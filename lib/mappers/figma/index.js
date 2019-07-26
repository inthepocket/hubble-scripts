const mapTextStyleFigma = require('./textstyle');
const mapColorFigma = require('./color');
const mapGradientFigma = require('./gradient');
const mapShadowFigma = require('./shadow');
const mapBorderFigma = require('./border');

module.exports = {
  textStyles: mapTextStyleFigma,
  colors: mapColorFigma,
  gradients: mapGradientFigma,
  shadows: mapShadowFigma,
  borders: mapBorderFigma,
};
