const camelcase = require('camelcase');

const { tokenize, normalizeColorValues, formatColor } = require('../../utils');

function getRadius(shape) {
  if (Object.prototype.hasOwnProperty.call(shape, 'r')) {
    return shape.r;
  } 

  return 0;
};

function mapBorder(artboard) {
  const { style } = artboard.value;
  
  return {
    id: camelcase(artboard.name),
    token: tokenize('border'),
    width: style.stroke.width,
    // type: style.stroke.align.toUpperCase(),
    radius: getRadius(artboard.value.shape),
    color: formatColor({ ...normalizeColorValues(style.stroke.color.value), alpha: 1 }),
  }
};

module.exports = mapBorder;
