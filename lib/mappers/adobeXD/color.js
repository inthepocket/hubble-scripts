const { formatColor } = require('../../utils');

function mapColor(artboard) {
  const colorValue = artboard.value.group.children[0].style.fill.color.value;
  const { r, g, b } = colorValue;
  
  return formatColor({ red: r, green: g, blue: b, alpha: 1});
}

module.exports = mapColor;
