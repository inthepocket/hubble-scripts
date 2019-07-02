const camelCase = require('camelcase');

const {
  createTreeOfLeastDepth,
  outputHelper,
  sortByProperty,
  uniqueArrayByProperty,
  getTypographicId,
} = require('./util');

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
  mapTextStyleFonts,
};
