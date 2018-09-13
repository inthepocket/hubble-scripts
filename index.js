const fs = require('fs');
const sketch2json = require('sketch2json');

const { getPageArrays, getColorsFromArtboard } = require('./lib/sketch');
const { prettyJSON } = require('./lib/utils');
const { mapTextStyles, mapColors } = require('./lib/mappers');

module.exports = (args, flags) => {
  if (args.length <= 0) throw new Error('No file input passed after npm start');

  const [filePath] = args;

  fs.readFile(filePath, async (error, data) => {
    if (error) throw new Error(error);

    try {
      const response = await sketch2json(data);
      let colorLayers;

      const primitivesPage = getPageArrays(response).find(i => i.name === 'primitives');
      if (primitivesPage && flags.useColorArtboards) {
        colorLayers = getColorsFromArtboard(primitivesPage.layers);
      } else {
        colorLayers = response.document.assets.colors;
      }


      const mapping = {
        textStyles: mapTextStyles(response.document.layerTextStyles),
        colors: mapColors(colorLayers),
        fonts: response.meta.fonts,
        sketchVersion: response.meta.appVersion,
      };

      await fs.writeFile(
        `${flags.outputDir}/sketchxport.json`,
        prettyJSON(mapping),
        err => err && console.error(err),
      );

      if (flags.dump) {
        await fs.writeFile(
          `${flags.outputDir}/logdump.json`,
          prettyJSON(response),
          err => err && console.error(err),
        );
      }

      return response;
    } catch (err) {
      throw new Error(err);
    }
  });
};
