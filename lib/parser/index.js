const sketch2json = require('sketch2json');
const { getClient, figma2jsonFromAPI, findIds } = require('../figma');
const { isSketch } = require('../utils');
const {
  getPageArrays,
  getColorsFromArtboard,
  getGradientsFromArtboard,
  getShadowsFromArtboard,
  getBordersFromArtboard,
} = require('../../lib/sketch');
const { readFile, uniqueArray } = require('../utils');

const parseTokens = async (args, flags) => {
  const [file] = args;
  if (isSketch(file)) {
    try {
      const response = await sketch2json(await readFile(file));
      const primitivesPage = getPageArrays(response).find(
        i => i.name.toLowerCase() === 'primitives',
      );
      if (!primitivesPage) {
        throw new Error(`No primitives page found.`);
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
        version: response.meta.appVersion,
        response,
      };
    } catch (err) {
      throw new Error(err);
    }
  } else {
    const { token } = flags;
    if (!token) {
      throw new Error('Please add a Figma API authorization token');
    }

    const client = getClient(token);
    const response = await figma2jsonFromAPI(client, file);
    return {
      colors: findIds('color'),
      textStyles: findIds('textstyle'),
      fonts: uniqueArray(findIds('text').map(text => text.children[0].style.fontPostScriptName)),
      gradients: findIds('gradient'),
      shadows: findIds('shadow'),
      borders: findIds('border'),
      response,
      version: undefined,
    };
  }
};

module.exports = (args, flags) => ({
    parser: {
      getTokens: () => parseTokens(args, flags)
    }
});
