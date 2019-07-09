const mapTextStyleSketch = require('./sketch/textstyle');
const mapColorSketch = require('./sketch/color');
const mapGradientSketch = require('./sketch/gradient');
const mapShadowSketch = require('./sketch/shadow');
const mapBorderSketch = require('./sketch/border');

const mapTextStyleFigma = require('./figma/textstyle');
const mapColorFigma = require('./figma/color');
const mapGradientFigma = require('./figma/gradient');
const mapShadowFigma = require('./figma/shadow');
const mapBorderFigma = require('./figma/border');

module.exports = extension => {
  const ex = extension.toLowerCase();

  module.mapColors = colors =>
    ex === 'sketch' ? colors.map(mapColorSketch) : colors.map(mapColorFigma);
  module.mapTextStyles = textStyles =>
    ex === 'sketch'
      ? textStyles.objects.map(mapTextStyleSketch)
      : textStyles.map(mapTextStyleFigma);
  module.mapGradients = gradients =>
    ex === 'sketch' ? gradients.map(mapGradientSketch) : gradients.map(mapGradientFigma);
  module.mapShadows = shadows =>
    ex === 'sketch' ? shadows.map(mapShadowSketch) : shadows.map(mapShadowFigma);
  module.mapBorders = borders =>
    ex === 'sketch' ? borders.map(mapBorderSketch) : borders.map(mapBorderFigma);

  return module;
};
