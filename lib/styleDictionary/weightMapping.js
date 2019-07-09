const {
  createTreeOfLeastDepth,
  getTypographicId,
  outputHelper,
  sortByProperty,
  uniqueArrayByProperty,
} = require('./util');

const { getFontWeight } = require('../font');

const mapFontWeights = (textStyles = []) => {
  const fonts = uniqueArrayByProperty(textStyles, 'family').sort(sortByProperty('family'));

  const output = createTreeOfLeastDepth(fonts, ['family'], token => ({
    value: getFontWeight(token.weight),
  }));

  return outputHelper('fontFamily', output);
};

const mapTextStyleWeights = (textStyles = []) => {
  const typographicElements = uniqueArrayByProperty(textStyles, 'id', getTypographicId).sort(
    sortByProperty('id'),
  );

  const output = createTreeOfLeastDepth(typographicElements, ['id'], token => ({
    value: getFontWeight(token.weight),
  }));

  return outputHelper('font', output);
};

module.exports = {
  mapFontWeights,
  mapTextStyleWeights,
};
