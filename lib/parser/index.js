const sketch2json = require('sketch2json');
const Figma = require('figma-js');

const { findTokens, flattenChildren } = require('../figma');
const { isSketch } = require('../utils');
const {
  getPageArrays,
  getColorsFromArtboard,
  getGradientsFromArtboard,
  getShadowsFromArtboard,
  getBordersFromArtboard,
} = require('../../lib/sketch');
const { readFile, uniqueArray } = require('../utils');
const { FILE_TYPES } = require('./constants');

const parseTokens = async (args, flags) => {
  const [file] = args;

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
        fonts: response.meta.fonts,
        version: response.meta.appVersion, // Sketch Application Version
        fileType: FILE_TYPES.SKETCH,
        response,
      };
    } catch (err) {
      throw new Error(err);
    }
  } else {
    try {
      const { token } = flags;
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

      return {
        colors: findTokens(response, 'color'),
        textStyles: findTokens(response, 'textstyle'),
        fonts: uniqueArray(
          findTokens(response, 'text')
            .map(text => text.children[0].style.fontPostScriptName)
        ),
        gradients: findTokens(response, 'gradient'),
        shadows: findTokens(response, 'shadow'),
        borders: findTokens(response, 'border'),
        version: 'v1', // Figma API Version
        fileType: FILE_TYPES.FIGMA,
        response: data,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
};

module.exports = (args, flags) => ({
  parser: {
    getTokens: () => parseTokens(args, flags),
  },
});
