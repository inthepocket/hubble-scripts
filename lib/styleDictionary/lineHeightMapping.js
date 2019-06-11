const {
  createTreeOfLeastDepth,
  getTypographicId,
  outputHelper,
  uniqueArrayByProperty,
  sortByProperty,
} = require('./util');

/**
 * Maps the line heights of the given input textStyle generic tokens to Style Dictionary compatible
 * line height tokens.
 *
 * @param Array textStyles: an array of generic style textStyle tokens
 * @returns Object: a StyleDictionary tree of type 'font' with 'lineHeight' items.
 */
const mapTextStyleLineHeights = (textStyles = []) => {
  const typographicElements = uniqueArrayByProperty(
    textStyles, 'id', getTypographicId
  ).sort(sortByProperty('id'));

  const output = createTreeOfLeastDepth(
    typographicElements,
    ['id'],
    token => ({ value: parseFloat(token.lineHeight) })
  );

  return outputHelper('font', output);
};

module.exports = {
  mapTextStyleLineHeights,
};
