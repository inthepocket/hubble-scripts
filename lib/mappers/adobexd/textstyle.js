const camelcase = require('camelcase');
const { tokenize, getFontWeight } = require('../../utils');

function mapTextStyle(document) {
  const { content } = document.representations[0];

  return {
    token: tokenize('textStyle'),
    id: camelcase(document.name.split('/').shift()),
    weight: getFontWeight(content.fontFamily),
    size: content.fontSize,
    family: content.fontFamily,
    borderBottom: content.underline ? true : null,
    kerning: Number(content.charSpacing.toFixed(0)) !== 0 ? parseFloat(content.charSpacing.toFixed(1)) : null,
  };
};

module.exports = mapTextStyle;
