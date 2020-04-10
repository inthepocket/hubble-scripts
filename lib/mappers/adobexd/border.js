const camelcase = require('camelcase');

const { tokenize, normalizeColorValues, formatColor, hasProp } = require('../../utils');

function mapBorder(artboard) {
  const { style, shape } = artboard.value;
  const { color } = style.stroke;
  const alpha = hasProp(color, 'alpha') ? color.alpha : 1;
  
  return {
    id: camelcase(artboard.name),
    token: tokenize('border'),
    width: style.stroke.width,
    type: hasProp(style.stroke, 'align') ? style.stroke.align.toUpperCase() : 'CENTER',
    radius: hasProp(shape, 'r') ? shape.r : 1,
    color: formatColor({ ...normalizeColorValues(color.value), alpha }),
  }
};

module.exports = mapBorder;
