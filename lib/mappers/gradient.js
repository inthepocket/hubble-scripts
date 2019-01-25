/* eslint-disable no-underscore-dangle */
const camelcase = require('camelcase');

const formatColor = require('./color');
const { tokenize } = require('../utils');

const GRADIENT_TYPES = ['LINEAR', 'RADIAL', 'ANGULAR']

const formatCoordinates = (coords) => {
  const coordinates = coords.match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g);
  return coordinates ? coordinates.map(parseFloat) : [];
}

module.exports = (gradient) => ({
  ...(gradient._class === 'artboardGradient' ? { id: camelcase(gradient.id) || null } : {}),
  token: tokenize('gradient'),
  type: GRADIENT_TYPES[gradient.gradientType],
  from: formatCoordinates(gradient.from),
  to: formatCoordinates(gradient.to),
  stops: gradient.stops.map(g => ({
    position: g.position,
    color: formatColor(g.color),
  })),
});
