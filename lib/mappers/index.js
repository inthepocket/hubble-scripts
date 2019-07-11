const mapFigma = require('./figma');
const mapSketch = require('./sketch');

module.exports = sketch => ({
  textStyles: sketch ? mapSketch.textStyles : mapFigma.textStyles,
  colors: sketch ? mapSketch.colors : mapFigma.colors,
  gradients: sketch ? mapSketch.gradients : mapFigma.gradients,
  shadows: sketch ? mapSketch.shadows : mapFigma.shadows,
  borders: sketch ? mapSketch.borders : mapFigma.borders,
  version: version => (sketch ? { sketchVersion: version } : null),
});
