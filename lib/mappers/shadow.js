const formatColor = require('./color');

module.exports = (shadow) => ({
  blur: shadow.blurRadius,
  x: shadow.offsetX,
  y: shadow.offsetY,
  spread: shadow.spread,
  type: shadow.type,
  color: formatColor(shadow.color),
})
