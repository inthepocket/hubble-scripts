const sketch2json = require('sketch2json');
const Figma = require('figma-js');

const { findAllTokens, flattenChildren, retrieveImageUrls } = require('../figma');
const { isSketch } = require('../utils');
const {
  getPageArrays,
  getColorsFromArtboard,
  getColorsFromDocument,
  getGradientsFromArtboard,
  getGradientsFromDocument,
  getShadowsFromArtboard,
  getBordersFromArtboard,
  getBlursFromArtboard,
} = require('../../lib/sketch');
const { readFile, uniqueArray } = require('../utils');
const { FILE_TYPES, SKETCH_MODES } = require('./constants');

const parseTokens = async (args, flags) => {
  const [file] = args;

  if (isSketch(file)) {
    const validSketchModes = Object.values(SKETCH_MODES);
    if (!validSketchModes.includes(flags.mode)) {
      throw new Error(`
        Invalid mode selected for this sketch file. Must be one of ${validSketchModes.join(', ')}.
        For more info, add --help flag.
      `);
    }

    const useColorArtboards = flags.useColorArtboards || flags.mode === SKETCH_MODES.ARTBOARD;
    const useGradientArtboards = flags.useGradientArtboards || flags.mode === SKETCH_MODES.ARTBOARD;
    const useLayerstyles = flags.mode === SKETCH_MODES.LAYERSTYLE;

    if ((useColorArtboards || useGradientArtboards) && useLayerstyles) {
      throw new Error(`
        Do not mix layerstyle mode with deprecated artboard flags (useColorArtboards or useGradientArtboards).
        For more info, add --help flag.
      `);
    }

    const getPrimitivesPage = response => {
      const primitivesPage = getPageArrays(response).find(
        i => i.name.toLowerCase() === 'primitives',
      );

      if (!primitivesPage) {
        throw new Error(`
          No primitives page found, skipping exporting of tokens.
          Please see https://github.com/inthepocket/hubble-sketch-plugin/wiki/Artboard-formatting#primitives-page on how to structure your Sketch file.
        `);
      }

      return primitivesPage.layers;
    };

    try {
      const response = await sketch2json(await readFile(file));

      const result = {
        textStyles: response.document.layerTextStyles.objects,
        fonts: response.meta.fonts,
        assets: null,
        version: response.meta.appVersion, // Sketch Application Version
        fileType: FILE_TYPES.SKETCH,
        response,
      };

      if (useLayerstyles) {
        // TODO
        return result;
      }

      const primitivesLayers = getPrimitivesPage(response);

      return {
        ...result,
        colors: useColorArtboards
          ? getColorsFromArtboard(primitivesLayers)
          : getColorsFromDocument(response.document),
        gradients: useGradientArtboards
          ? getGradientsFromArtboard(primitivesLayers)
          : getGradientsFromDocument(response.document),
        shadows: getShadowsFromArtboard(primitivesLayers),
        borders: getBordersFromArtboard(primitivesLayers),
        blurs: getBlursFromArtboard(primitivesLayers),
      }
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

      let assets = null;
      if (exportAssets) {
        assets = await retrieveImageUrls(client, file, response);
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
        assets,
        version: 'v1', // Figma API Version
        fileType: FILE_TYPES.FIGMA,
        response: data,
      };
    } catch (err) {
      if (err.response) {
        const httpCode = err.response.status;
        if (httpCode === 404) {
          throw new Error(`The Figma file was not found. Double check if the provided id "${file}" is correct and the file exists.`)
        } else if (httpCode === 403) {
          throw new Error(`Invalid Figma token. Double check if the provided token is correct, and you have access rights to the file.`);
        }
      }

      throw err;
    }
  }
};

module.exports = (args, flags) => ({
  parser: {
    getTokens: () => parseTokens(args, flags),
  },
});
