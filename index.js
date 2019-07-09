const fs = require('fs');
const pkg = require('./package.json');
const getParser = require('./lib/parser');
const getMappers = require('./lib/mappers');
const { prettyJSON, getExtension } = require('./lib/utils');
const mapToStyleDictionaryTokens = require('./lib/styleDictionary');

module.exports = async (args, flags) => {
  if (flags.version) return pkg.version;

  if (args.length <= 0) throw new Error('No file input passed after npm start');
  const [file] = args;
  const { parser } = await getParser(args, flags);
  const {
    textStyles,
    colors,
    gradients,
    shadows,
    borders,
    fonts,
    version,
    response,
  } = await parser.getTokens();

  const mappers = getMappers(getExtension(file));

  const mapping = {
    textStyles: mappers.mapTextStyles(textStyles),
    colors: mappers.mapColors(colors),
    gradients: mappers.mapGradients(gradients),
    shadows: mappers.mapShadows(shadows),
    borders: mappers.mapBorders(borders),
    fonts,
    version,
  };

  if (!fs.existsSync(flags.outputDir)) {
    fs.mkdirSync(flags.outputDir);
  }

  const fsErrorHandler = err => {
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
};
