const fs = require('fs');
const pkg = require('./package.json');
const getParser = require('./lib/parser');
const getMappers = require('./lib/mappers');
const { prettyJSON} = require('./lib/utils');
const mapToStyleDictionaryTokens = require('./lib/styleDictionary');

const getExtension = (file) => file.split('.').pop();
exports.getExtension = getExtension;

module.exports = async(args, flags) => {
  if (flags.version) return pkg.version;

  if (args.length <= 0) throw new Error('No file input passed after npm start');
  const [file] = args
  const {parser, response} = await getParser(args, flags);
  const mappers = getMappers(getExtension(file));
  
  const mapping = {
    textStyles: mappers.mapTextStyles(parser.getTextStyles()),
    colors: mappers.mapColors(parser.getColors()),
    gradients: mappers.mapGradients(parser.getGradients()),
    shadows: mappers.mapShadows(parser.getShadows()),
    borders: mappers.mapBorders(parser.getBorders()),
    fonts: parser.getFonts(),
    ...parser.getVersion()
  }

  if (!fs.existsSync(flags.outputDir)) {
    fs.mkdirSync(flags.outputDir);
  }

  const fsErrorHandler = (err) => {
    if (err) {
      console.error('Error trying to write to file:', err); // eslint-disable-line no-console
      throw new Error(err);
    }
  };

  if (flags.useStyleDictionaryOutput) {
    await fs.writeFile(
      `${flags.outputDir}/hubble-style-dictionary-tokens.json`,
      prettyJSON(mapToStyleDictionaryTokens(mapping)),
      fsErrorHandler,
    );
  } else {
    await fs.writeFile(`${flags.outputDir}/hubble-data.json`, prettyJSON(mapping), fsErrorHandler);
  }

  if (flags.dump) {
    await fs.writeFile(`${flags.outputDir}/logdump.json`, prettyJSON(response), fsErrorHandler);
  }
  return response;
}
