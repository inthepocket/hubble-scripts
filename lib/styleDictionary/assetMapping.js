const {
  createTreeOfLeastDepth,
  outputHelper,
  uniqueArrayByProperty,
} = require('./util');

/**
 * Maps the assets of the given input textStyle ITP tokens to Style Dictionary compatible asset
 * tokens.
 *
 * @param Array textStyles: an array of ITP style textStyle tokens
 * @returns Object: a StyleDictionary tree of type 'font' with 'asset' items.
 */
const mapTextStyleAssets = (textStyles = []) => {
  const output = createTreeOfLeastDepth(
    uniqueArrayByProperty(textStyles, 'family'),
    ['family'],
    token => ({
      name: { value: token.family },
    })
  );

  return outputHelper('font', output);
}

module.exports = {
  mapTextStyleAssets,
};
