const formatColor = require('../sketch/color');
const { tokenize, mapColorKeys } = require('../../utils');

// Property locations differ with regular gradients and shadow gradients
const getGradientPropertyLocation = gradient =>
  gradient.gradientHandlePositions ? gradient : gradient.children[0].fills[0];

const getGradientStops = gradient => {
  const { gradientStops } = getGradientPropertyLocation(gradient);
  return {
    stops:
      gradientStops !== undefined
        ? gradientStops.map(stop => ({
            position: stop.position,
            color: formatColor(mapColorKeys(stop.color)),
          }))
        : null,
  };
};

const getGradientLocations = gradient => {
  const { gradientHandlePositions } = getGradientPropertyLocation(gradient);
  const lastGradient = gradientHandlePositions
    ? gradientHandlePositions[gradientHandlePositions.length - 1]
    : undefined;
  return {
    from: gradientHandlePositions
      ? [gradientHandlePositions[0].x, gradientHandlePositions[0].y]
      : null,
    to: lastGradient ? [lastGradient.x, lastGradient.y] : null,
  };
};

module.exports = gradient => ({
  name: gradient.name ? gradient.name.split('/').pop() : null,
  token: tokenize('gradient'),
  type: gradient.type,
  ...getGradientLocations(gradient),
  ...getGradientStops(gradient),
});
