const formatColor = require('./color');
const { tokenize } = require('../utils');

const GRADIENT_TYPES = ['LINEAR', 'RADIAL', 'ANGULAR']

module.exports = (gradient) => ({
  token: tokenize('gradient'),
  type: GRADIENT_TYPES[gradient.gradientType],
  from: gradient.from,
  to: gradient.to,
  stops: gradient.stops.map(g => ({
    position: g.position,
    color: formatColor(g.color),
  })),
});
