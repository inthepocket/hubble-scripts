const {
  createTreeOfLeastDepth,
  getTypographicId,
  outputHelper,
  uniqueArrayByProperty,
  sortByProperty,
} = require('./util');

/**
 * Maps the sizes of the given input textStyle ITP tokens to Style Dictionary compatible size
 * tokens.
 *
 * @param Array textStyles: an array of ITP style textStyle tokens
 * @returns Object: a StyleDictionary tree of type 'font' with 'size' items.
 */
const mapTextStyleSizes = (textStyles = []) => {
  const typographicElements = uniqueArrayByProperty(
    textStyles, 'id', getTypographicId
  ).sort(sortByProperty('id'));

  const output = createTreeOfLeastDepth(
    typographicElements,
    ['id'],
    token => ({ value: parseFloat(token.size) })
  );

  return outputHelper('font', output);
};

/**
 * Maps the sizes of the given input borders ITP tokens to Style Dictionary compatible size
 * tokens.
 *
 * @param Array borderStyles: an array of ITP style borders tokens
 * @returns Object: a StyleDictionary tree of type 'border' with 'size' items.
 */
const mapBorderStyleSizes = (borderStyles = []) => {
  const output = createTreeOfLeastDepth(
    borderStyles,
    ['id'],
    token => ({ value: `${token.width}` })
  );

  return outputHelper('border', output);
};

module.exports = {
  mapTextStyleSizes,
  mapBorderStyleSizes,
};
