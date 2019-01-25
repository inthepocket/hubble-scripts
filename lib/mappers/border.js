const camelcase = require('camelcase');

const formatColor = require('./color');
const mapGradient = require('./gradient');
const { uniqueArray, tokenize } = require('../utils');

const BORDER_TYPES = ['CENTER', 'INSIDE', 'OUTSIDE']

const borderRadius = (border) => {
  const corners = border.points.map(corner => corner.cornerRadius);
  const hasDiffCorners = uniqueArray(corners).length > 1;

  return hasDiffCorners ? corners : border.fixedRadius;
}

module.exports = (border) => (
  {
  id: camelcase(border.id),
  token: tokenize('border'),
  ...(border.fillType === 0
    ? { color: formatColor(border.color) }
    : { gradient: mapGradient(border.gradient) }
  ),
  width: border.thickness,
  type: BORDER_TYPES[border.position],
  radius: borderRadius(border),
})
