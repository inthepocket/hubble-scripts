const camelcase = require('camelcase');

const { tokenize, formatColor, normalizeColorValues, hasProp } = require('../../utils');

function getGradientStops(stops) {
  return stops.map(stop => {
    const { color } = stop;
    const alpha = hasProp(color, 'alpha') ? color.alpha : 1;

    return {
      position: stop.offset,
      color: formatColor({ ...normalizeColorValues(color.value), alpha }),
    }
  });
};

function mapGradient(artboard) {
  const { gradient } = artboard.value.style.fill;
  const gradientSettings = gradient.meta.ux.gradientResources;

  const type = gradientSettings.type.toUpperCase();

  return {
    token: tokenize('gradient'),
    name: camelcase(artboard.name),
    type,
    from: type === "LINEAR" ? [ gradient.x1, gradient.y1 ] : [ gradient.cx, gradient.cy],
    to: type === 'LINEAR' ? [ gradient.x2, gradient.y2 ] : [ gradient.fx, gradient.fy ],
    stops: getGradientStops(gradientSettings.stops),
  }
};

module.exports = mapGradient;
