const mapTextStyle = require('./textstyle');
const mapColor = require('./color');
const mapGradient = require('./gradient');
const mapShadow = require('./shadow');
const mapBorder = require('./border');
const mapBlurs = require('./blur');

module.exports = {
  mapColors: colors => colors.map(mapColor),
  mapTextStyles: textStyles => textStyles.objects.map(mapTextStyle),
  mapGradients: gradients => gradients.map(mapGradient),
  mapShadows: shadows => shadows.map(mapShadow),
  mapBorders: borders => borders.map(mapBorder),
  mapBlurs: blurs => blurs.map(mapBlurs),
};
