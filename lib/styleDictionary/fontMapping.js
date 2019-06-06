const camelCase = require('camelcase');

const {
  createTreeOfLeastDepth,
  getBaseNameFromFontFamily,
  getVariantNameFromFontFamily,
  outputHelper,
  sortByProperty,
  uniqueArrayByProperty,
  getTypographicId,
} = require('./util');

const mapTextStyleFontFamilies = (textStyles = []) => {
  const fonts = uniqueArrayByProperty(
    textStyles, 'family',
  ).sort(sortByProperty('family'));

  const output = createTreeOfLeastDepth(
    fonts,
    ['family'],
    token => ({
      id: { value: token.family },
      family: { value: getBaseNameFromFontFamily(token.family) },
      variant: { value: getVariantNameFromFontFamily(token.family) },
      asset: { value: `asset.font.${camelCase(token.family)}.name.value`},
    })
  );

  return outputHelper('family', output);
};

const mapTextStyleFonts = (textStyles = []) => {
  const typographicElements = uniqueArrayByProperty(
    textStyles, 'id', getTypographicId
  ).sort(sortByProperty('id'));

  const output = createTreeOfLeastDepth(
    typographicElements,
    ['id'],
    token => ({ value: `${camelCase(token.family)}` }),
  );

  return outputHelper('typo', output);
};

module.exports = {
  mapTextStyleFontFamilies,
  mapTextStyleFonts,
};
