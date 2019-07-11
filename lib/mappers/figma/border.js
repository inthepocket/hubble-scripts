const { mapColorKeys } = require('../../utils');
const formatColor = require('../sketch/color');
const { tokenize } = require('../../utils');
const mapGradient = require('./gradient');

const getGradientPropertyLocation = border => border.children[0].strokes[0];

const getBorderInfo = border => {
  const [info] = border.children;
  return {
    width: info.strokeWeight,
    type: info.strokeAlign,
    radius:
      (border.name.toLowerCase().includes('gradient')
        ? info.rectangleCornerRadii
        : info.cornerRadius) || 0,
  };
};

const getColorInfo = border => {
  const { color } = getGradientPropertyLocation(border);
  return {
    color: formatColor(mapColorKeys(color)),
  };
};

const getGradientInfo = border => ({
  gradient: mapGradient(getGradientPropertyLocation(border)),
});

module.exports = border => ({
    id: border.name.split('/').pop(),
    token: tokenize('border'),
    ...getBorderInfo(border),
    ...(border.name.toLowerCase().includes('gradient')
      ? getGradientInfo(border)
      : getColorInfo(border)),
  }); 

