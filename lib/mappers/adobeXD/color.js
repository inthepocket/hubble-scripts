const camelcase = require('camelcase');

const { formatColor, normalizeColorValues } = require('../../utils');


function mapColor(artboard) {
  const colorValue = artboard.value.group.children[0].style.fill.color.value;
  
  return {
    ...formatColor({ ...normalizeColorValues(colorValue), alpha: 1}),
    id: camelcase(artboard.name.replace('/', '')),
    variant: artboard.name.split('/').pop(),
  };
}

module.exports = mapColor;
