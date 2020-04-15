const camelcase = require('camelcase');

const { formatColor, normalizeColorValues, hasProp } = require('../../utils');


function mapColor(artboard) {
  const { color } = artboard.value.group.children[0].style.fill;
  const alpha = hasProp(color, 'alpha') ? color.alpha : 1;
  
  return {
    ...formatColor({ ...normalizeColorValues(color.value), alpha}),
    id: camelcase(artboard.name.replace('/', '')),
    variant: artboard.name.split('/').pop(),
  };
}

module.exports = mapColor;
