const camelcase = require('camelcase');
const { getFontWeight, tokenize } = require('../../utils');

const getStyleProperty = textStyle => textStyle.children[0].style;

const getTextStyle = textStyle => {
  const style = getStyleProperty(textStyle);
  return {
    weight: getFontWeight(style.fontPostScriptName),
    borderBottom: style.textDecoration === 'UNDERLINE' ? true : null,
    paragraphSpacing: style.paragraphSpacing || null,
    size: style.fontSize,
    family: style.fontPostScriptName,
    lineHeight: Number(style.lineHeightPx.toFixed(1)),
    kerning:
      Number(style.letterSpacing.toFixed(0)) !== 0 ? Number(style.letterSpacing.toFixed(0)) : null,
  };
};

module.exports = textStyle => ({
  token: tokenize('textStyle'),
  ...getTextStyle(textStyle),
  id: camelcase(textStyle.name.split('/').pop()),
});
