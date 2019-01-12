const formatColor = require('./color');

module.exports = style => {
  const attrs = style.value.textStyle.encodedAttributes;

  return {
    id: style.name,
    weight: null,
    size: attrs.MSAttributedStringFontAttribute.attributes.size,
    family: attrs.MSAttributedStringFontAttribute.attributes.name,
    borderBottom: attrs.underlineStyle || null,
    color: formatColor(attrs.MSAttributedStringColorAttribute),
    kerning: attrs.kerning || null,
  };
}
