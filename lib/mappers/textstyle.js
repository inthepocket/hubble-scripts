const camelcase = require('camelcase');

const formatColor = require('./color');
const { tokenize, calculateDefaultLineHeight } = require('../utils');

/**
 * Return the font weight based from the font family
 * If the font family name does not contain a weight, return null
 * e.g Helvetica-Bold -> weight: 'bold' / Helvetica -> weight: null
 */
const getFontWeight = (family) => {
  const chunks = family.split('-');
  return chunks.length > 1
    ? chunks[chunks.length -1].toLowerCase()
    : null;
}

/**
 * Return paragraph styles (line height + paragraph spacing) if provided
 * else return sensible defaults.
 */
const getParagraphStyle = (style) => {
  if (!style.paragraphStyle) return {};

  const { maximumLineHeight, paragraphSpacing } = style.paragraphStyle
  return {
    lineHeight: maximumLineHeight
      ? parseFloat(style.paragraphStyle.maximumLineHeight.toFixed(2))
      : calculateDefaultLineHeight(style.MSAttributedStringFontAttribute.attributes),
    paragraphSpacing: paragraphSpacing
      ? parseFloat(style.paragraphStyle.paragraphSpacing.toFixed(2))
      : 0,
  }
};

module.exports = style => {
  const attrs = style.value.textStyle.encodedAttributes;

  return {
    token: tokenize('textStyle'),
    id: camelcase(style.name),
    weight: getFontWeight(attrs.MSAttributedStringFontAttribute.attributes.name),
    size: attrs.MSAttributedStringFontAttribute.attributes.size,
    family: attrs.MSAttributedStringFontAttribute.attributes.name,
    borderBottom: attrs.underlineStyle || null,
    // eslint-disable-next-line no-prototype-builtins
    kerning: attrs.hasOwnProperty('kerning') ? parseFloat(attrs.kerning.toFixed(2)) : null,
    ...getParagraphStyle(attrs),
  };
}
