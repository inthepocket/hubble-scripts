const fs = require('fs');
const sketch2json = require('sketch2json');
const pkg = require('./package.json');

const {
  getPageArrays, getColorsFromArtboard, getGradientsFromArtboard, getShadowsFromArtboard,
  getBordersFromArtboard
} = require('./lib/sketch');
const mappers = require('./lib/mappers');
const { prettyJSON } = require('./lib/utils');

module.exports = (args, flags) => {
  if (flags.version) return pkg.version;

  if (args.length <= 0) throw new Error('No file input passed after npm start');

  const [filePath] = args;

  return fs.readFile(filePath, async (error, data) => {
    if (error) throw new Error(error);

    try {
      const response = await sketch2json(data);

      const primitivesPage = getPageArrays(response).find(i => i.name.toLowerCase() === 'primitives');
      if (!primitivesPage) {
        throw new Error(`No primitives page found.`)
      }

      const colorLayers = flags.useColorArtboards
        ? getColorsFromArtboard(primitivesPage.layers)
        : response.document.assets.colorAssets
            .map(({ color, _class, name }) => ({ ...color, _class, name }));
      const gradientLayers = flags.useGradientArtboards
        ? getGradientsFromArtboard(primitivesPage.layers)
        : response.document.assets.gradientAssets
            .map(({ gradient, _class }) => ({ ...gradient, _class }));

      const mapping = {
        textStyles: mappers.mapTextStyles(response.document.layerTextStyles),
        colors: mappers.mapColors(colorLayers),
        gradients: mappers.mapGradients(gradientLayers),
        shadows: mappers.mapShadows(getShadowsFromArtboard(primitivesPage.layers)),
        borders: mappers.mapBorders(getBordersFromArtboard(primitivesPage.layers)),
        fonts: response.meta.fonts,
        sketchVersion: response.meta.appVersion,
      };

      if (!fs.existsSync(flags.outputDir)) {
        fs.mkdirSync(flags.outputDir);
      }

      await fs.writeFile(`${flags.outputDir}/hubble-data.json`, prettyJSON(mapping));

      if (flags.dump) {
        await fs.writeFile(`${flags.outputDir}/logdump.json`, prettyJSON(response));
      }

      return response;
    } catch (err) {
      throw new Error(err);
    }
  });
};
