const camelCase = require('camelcase');

// based on https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Common_weight_name_mapping
const FONT_WEIGHT = {
  thin: 100,
  extraLight: 200,
  light: 300,
  book: 350, // exceptional, book variants should not be used for devices, but just in case
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

const fontWeights = Object.keys(FONT_WEIGHT).map(weightId => ({
  name: weightId,
  value: FONT_WEIGHT[weightId],
}));

const getFontWeight = fontWeightName => {
  const key = camelCase(fontWeightName);
  return typeof FONT_WEIGHT[key] !== 'undefined' ? FONT_WEIGHT[key] : FONT_WEIGHT.normal;
};

module.exports = {
  FONT_WEIGHT,
  fontWeights,
  getFontWeight,
};
