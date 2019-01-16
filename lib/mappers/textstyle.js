const camelcase = require('camelcase');

const formatColor = require('./color');
const { tokenize } = require('../utils');

module.exports = style => {
  const attrs = style.value.textStyle.encodedAttributes;

  return {
    token: tokenize('textStyle'),
    id: camelcase(style.name),
    weight: null,
    size: attrs.MSAttributedStringFontAttribute.attributes.size,
    family: attrs.MSAttributedStringFontAttribute.attributes.name,
    borderBottom: attrs.underlineStyle || null,
    color: formatColor(attrs.MSAttributedStringColorAttribute),
    kerning: attrs.kerning || null,
  };
}
