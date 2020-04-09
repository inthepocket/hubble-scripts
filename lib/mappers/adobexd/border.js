const camelcase = require('camelcase');

const { tokenize, normalizeColorValues, formatColor, hasProp } = require('../../utils');

function mapBorder(artboard) {
  const { style, shape } = artboard.value;
  
  return {
    id: camelcase(artboard.name),
    token: tokenize('border'),
    width: style.stroke.width,
    type: hasProp(style.stroke, 'align') ? style.stroke.align.toUpperCase() : 'CENTER',
    radius: hasProp(shape, 'r') ? shape.r : 1,
    color: formatColor({ ...normalizeColorValues(style.stroke.color.value), alpha: 1 }),
  }
};

module.exports = mapBorder;
