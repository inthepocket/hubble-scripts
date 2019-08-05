const camelcase = require('camelcase');

const formatColor = require('../sketch/color');
const { tokenize, mapColorKeys, getNamedColorFromRGB } = require('../../utils');

// Property locations differ with regular gradients and shadow gradients
const getGradientPropertyLocation = gradient =>
  gradient.gradientHandlePositions ? gradient : gradient.children[0].fills[0];

const getGradientStops = gradient => {
  const { gradientStops } = getGradientPropertyLocation(gradient);
  return gradientStops !== undefined
    ? gradientStops.map(stop => ({
        position: stop.position,
        color: formatColor(mapColorKeys(stop.color)),
      }))
    : [];
};

const getGradientLocations = gradient => {
  const { gradientHandlePositions } = getGradientPropertyLocation(gradient);
  const lastGradient = gradientHandlePositions
    ? gradientHandlePositions[gradientHandlePositions.length - 1]
    : undefined;
  return {
    from: Array.isArray(gradientHandlePositions)
      ? [gradientHandlePositions[0].x, gradientHandlePositions[0].y]
      : null,
    to: lastGradient ? [lastGradient.x, lastGradient.y] : null,
  };
};

module.exports = gradient => {
  const computedColorName = getNamedColorFromRGB(
    getGradientStops(gradient)[0].color.rgb
  );

  return {
    name: gradient.name ? gradient.name.split('/').pop() : camelcase(`${computedColorName}-gradient`),
    token: tokenize('gradient'),
    type: getGradientPropertyLocation(gradient).type.split('GRADIENT_').pop(),
    ...getGradientLocations(gradient),
    stops: getGradientStops(gradient),
  }
};
