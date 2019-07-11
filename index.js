const fs = require('fs');
const pkg = require('./package.json');
const getParser = require('./lib/parser');
const getMappers = require('./lib/mappers');
const { prettyJSON, isSketch, writeFile } = require('./lib/utils');
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

  const mappers = getMappers(isSketch(file));

  const mapping = {
    textStyles: textStyles.map(mappers.textStyles),
    colors: colors.map(mappers.colors),
    gradients: gradients.map(mappers.gradients),
    shadows: shadows.map(mappers.shadows),
    borders: borders.map(mappers.borders),
    fonts,
    ...mappers.version(version),
  };

  if (!fs.existsSync(flags.outputDir)) {
    fs.mkdirSync(flags.outputDir);
  }

  if (flags.useStyleDictionaryOutput) {
    await writeFile(
      `${flags.outputDir}/hubble-style-dictionary-tokens.json`,
      prettyJSON(mapToStyleDictionaryTokens(mapping)),
    );
  } else {
    await writeFile(`${flags.outputDir}/hubble-data.json`, prettyJSON(mapping));
  }

  if (flags.dump) {
    await writeFile(`${flags.outputDir}/logdump.json`, prettyJSON(response));
  }
  return response;
};
