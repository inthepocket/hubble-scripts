const fs = require('fs');
const path = require('path');

const pkg = require('./package.json');
const getParser = require('./lib/parser');
const getMappers = require('./lib/mappers');
const { prettyJSON, writeFile, downloadFile, uniqueArrayBy } = require('./lib/utils');
const mapToStyleDictionaryTokens = require('./lib/styleDictionary');

const ASSETS_DIR = 'assets';

module.exports = async (args, flags) => {
  if (flags.version) return pkg.version;
  if (args.length <= 0) throw new Error('No file input passed after npm start');

  const { parser } = await getParser(args, flags);
  const {
    textStyles,
    colors,
    gradients,
    shadows,
    borders,
    blurs,
    fonts,
    version,
    response,
    fileType,
    assets,
  } = await parser.getTokens();

  const mappers = getMappers(fileType);

  const mapping = {
    textStyles: uniqueArrayBy(
      textStyles.map((txt) => mappers.textStyles(txt, flags.ignoreTextStylePaths)),
      'id',
    ),
    colors: colors.map(mappers.colors),
    gradients: gradients.map(mappers.gradients),
    shadows: shadows.map(mappers.shadows),
    borders: borders.map(mappers.borders),
    blurs: blurs.map(mappers.blurs),
    fonts,
    fileType,
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

  if (flags.exportAssets && assets) {
    const fullAssetsDir = path.join(flags.outputDir, ASSETS_DIR);

    if (!fs.existsSync(fullAssetsDir)) {
      fs.mkdirSync(fullAssetsDir);
    }

    assets.forEach(asset => {
      downloadFile(fullAssetsDir, asset);
    });
  }

  if (flags.dump) {
    await writeFile(`${flags.outputDir}/logdump.json`, prettyJSON(response));
  }
  return response;
};
