const camelcase = require('camelcase');

const formatColor = require('./color');
const { tokenize } = require('../../utils');

module.exports = (shadow) => ({
  id: camelcase(shadow.id),
  token: tokenize('shadow'),
  blur: shadow.blurRadius,
  x: shadow.offsetX,
  y: shadow.offsetY,
  spread: shadow.spread,
  type: shadow.type,
  color: formatColor(shadow.color),
})
