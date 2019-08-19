const sketch2json = require('sketch2json');
const Figma = require('figma-js');

const { findAllTokens, flattenChildren, retrieveImageUrls } = require('../figma');
const { isSketch } = require('../utils');
const {
  getPageArrays,
  getColorsFromArtboard,
  getGradientsFromArtboard,
  getShadowsFromArtboard,
  getBordersFromArtboard,
  getBlursFromArtboard,
} = require('../../lib/sketch');
const { readFile, uniqueArray } = require('../utils');
const { FILE_TYPES } = require('./constants');

const parseTokens = async (args, flags) => {
  const [file] = args;
  let filesToDownload = [];

  if (isSketch(file)) {
    try {
      const response = await sketch2json(await readFile(file));
      const primitivesPage = getPageArrays(response).find(
        i => i.name.toLowerCase() === 'primitives',
      );
      if (!primitivesPage) {
        throw new Error(`
          No primitives page found, skipping exporting of tokens.
          Please see https://github.com/inthepocket/hubble-sketch-plugin/wiki/Artboard-formatting#primitives-page on how to structure your Sketch file.
        `);
      }

      return {
        colors: flags.useColorArtboards
          ? getColorsFromArtboard(primitivesPage.layers)
          : response.document.assets.colorAssets.map(({ color, _class, name }) => ({
              ...color,
              _class,
              name,
            })),
        gradients: flags.useGradientArtboards
          ? getGradientsFromArtboard(primitivesPage.layers)
          : response.document.assets.gradientAssets.map(({ gradient, _class }) => ({
              ...gradient,
              _class,
            })),
        textStyles: response.document.layerTextStyles.objects,
        shadows: getShadowsFromArtboard(primitivesPage.layers),
        borders: getBordersFromArtboard(primitivesPage.layers),
        blurs: getBlursFromArtboard(primitivesPage.layers),
        fonts: response.meta.fonts,
        version: response.meta.appVersion, // Sketch Application Version
        fileType: FILE_TYPES.SKETCH,
        filesToDownload,
        response,
      };
    } catch (err) {
      throw new Error(err);
    }
  } else {
    try {
      const { token, exportAssets } = flags;
      if (!token) throw new Error('Please add a Figma API authorization token');

      const client = Figma.Client({ personalAccessToken: token });
      const { data } = await client.file(file);

      const primitivesPage = data.document.children.find(i => i.name.toLowerCase() === 'primitives');

      if (!primitivesPage) {
        throw new Error(`
          No primitives page found, skipping exporting of tokens.
          Please see https://github.com/inthepocket/hubble-sketch-plugin/wiki/Artboard-formatting#primitives-page on how to structure your Figma file.
        `);
      }

      const response = flattenChildren(data.document);

      if (exportAssets) {
        filesToDownload = await retrieveImageUrls(client, file, response);
      }

      return {
        colors: findAllTokens(response, 'color'),
        textStyles: findAllTokens(response, 'textstyle'),
        fonts: uniqueArray(
          findAllTokens(response, 'text')
            .map(text => text.children[0].style.fontPostScriptName)
        ),
        gradients: findAllTokens(response, 'gradient'),
        shadows: findAllTokens(response, 'shadow'),
        borders: findAllTokens(response, 'border'),
        blurs: findAllTokens(response, 'blur'),
        version: 'v1', // Figma API Version
        fileType: FILE_TYPES.FIGMA,
        filesToDownload,
        response: data,
      };
    } catch (err) {
      if (err.response.status === 404) {
        throw new Error(`The Figma file was not found. Double check if the provided id "${file}" is correct and the file exists.`);
      } else if (err.response.status === 403) {
        throw new Error(`Invalid Figma token. Double check if the provided token is correct, and you have access rights to the file.`);
      } else {
        throw new Error(err);
      }
    }
  }
};

module.exports = (args, flags) => ({
  parser: {
    getTokens: () => parseTokens(args, flags),
  },
});
