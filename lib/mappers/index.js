const { FILE_TYPES } = require('../parser/constants');

const mapFigma = require('./figma');
const mapSketch = require('./sketch');
const mapAdobeXD = require('./adobeXD');

const MAPPERS = new Map([
  [FILE_TYPES.SKETCH, mapSketch],
  [FILE_TYPES.FIGMA, mapFigma],
  [FILE_TYPES.ADOBEXD, mapAdobeXD]
]);

module.exports = fileType => {
  const mapper = MAPPERS.get(fileType);

  if (!mapper) {
    throw new TypeError(`
      [lib/mappers]: Could not determine which mapper to use.
      A valid file type should be provided.
    `)
  }

  return {
    textStyles: mapper.textStyles,
    colors: mapper.colors,
    gradients: mapper.gradients,
    shadows: mapper.shadows,
    borders: mapper.borders,
    blurs: mapper.blurs,
    version: version => (fileType === FILE_TYPES.SKETCH ? { sketchVersion: version } : null),
  }
};
