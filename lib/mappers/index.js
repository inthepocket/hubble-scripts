const mapTextStyle = require('./textstyle');
const mapColor = require('./color');

module.exports = {
  mapColors: colors => colors.map(mapColor),
  mapTextStyles: textStyles => textStyles.objects.map(mapTextStyle),
};
