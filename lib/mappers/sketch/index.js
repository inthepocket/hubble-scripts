const mapTextStyleSketch = require('./textstyle');
const mapColorSketch = require('./color');
const mapGradientSketch = require('./gradient');
const mapShadowSketch = require('./shadow');
const mapBorderSketch = require('./border');

module.exports = {
  textStyles: mapTextStyleSketch,
  colors: mapColorSketch,
  gradients: mapGradientSketch,
  shadows: mapShadowSketch,
  borders: mapBorderSketch,
};
