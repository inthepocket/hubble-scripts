const mapTextStyle = require('./textstyle');
const mapColor = require('./color');
const mapGradient = require('./gradient');

module.exports = {
  mapColors: colors => colors.map(mapColor),
  mapTextStyles: textStyles => textStyles.objects.map(mapTextStyle),
  mapGradients: gradients => gradients.map(mapGradient),
};
