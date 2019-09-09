const camelcase = require('camelcase');
const { tokenize, calculateDefaultLineHeight, getFontWeight } = require('../../utils');

/**
 * Return paragraph styles (line height + paragraph spacing) if provided
 * else return sensible defaults.
 */
const getParagraphStyle = style => {
  if (!style.paragraphStyle) return {};

  const { maximumLineHeight, paragraphSpacing } = style.paragraphStyle;
  return {
    lineHeight: maximumLineHeight
      ? parseFloat(style.paragraphStyle.maximumLineHeight.toFixed(2))
      : calculateDefaultLineHeight(style.MSAttributedStringFontAttribute.attributes),
    paragraphSpacing: paragraphSpacing
      ? parseFloat(style.paragraphStyle.paragraphSpacing.toFixed(2))
      : 0,
  };
};

module.exports = (style, ignoreTextStylePaths) => {
  const attrs = style.value.textStyle.encodedAttributes;
  const name = ignoreTextStylePaths ? style.name.split('/').slice(0,1) : style.name;

  return {
    token: tokenize('textStyle'),
    id: camelcase(name),
    weight: getFontWeight(attrs.MSAttributedStringFontAttribute.attributes.name),
    size: attrs.MSAttributedStringFontAttribute.attributes.size,
    family: attrs.MSAttributedStringFontAttribute.attributes.name,
    borderBottom: attrs.underlineStyle || null,
    // eslint-disable-next-line no-prototype-builtins
    kerning: attrs.hasOwnProperty('kerning') ? parseFloat(attrs.kerning.toFixed(2)) : null,
    ...getParagraphStyle(attrs),
  };
};
