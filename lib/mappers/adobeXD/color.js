const camelcase = require('camelcase');

const { formatColor } = require('../../utils');

function mapColor(artboard) {
  const colorValue = artboard.value.group.children[0].style.fill.color.value;
  const convertedValues = Object.values(colorValue).map(value => value / 255);
  const [ r, g, b ] = convertedValues;
  
  return {
    ...formatColor({ red: r, green: g, blue: b, alpha: 1}),
    id: camelcase(artboard.name.replace('/', '')),
    variant: artboard.name.split('/').pop(),
  };
}

module.exports = mapColor;
