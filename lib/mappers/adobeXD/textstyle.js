const camelcase = require('camelcase');
const { tokenize, getFontWeight } = require('../../utils');

function mapTextStyle(artboard) {
  const { name } = artboard;
  const rangedStyles = artboard.value.meta.ux.rangedStyles[0];

  return {
    token: tokenize('textStyle'),
    id: camelcase(name.split('/').shift()),
    weight: getFontWeight(rangedStyles.fontFamily),
    size: rangedStyles.fontSize,
    family: rangedStyles.fontFamily,
    borderBottom: rangedStyles.underline ? true : null,
    kerning: Number(rangedStyles.charSpacing.toFixed(0)) !== 0 ? parseFloat(rangedStyles.charSpacing.toFixed(1)) : null,
  };
};

module.exports = mapTextStyle;
