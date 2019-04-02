const { outputHelper, createTreeOfLeastDepth } = require('./util');

/**
 * Maps the assets of the given input textStyle ITP tokens to Style Dictionry compatible asset
 * tokens.
 *
 * @param Array textStyles: an array of ITP style textStyle tokens
 * @returns Object: a StyleDictionary tree of type 'font' with 'asset' items.
 */
const mapTextStyleAssets = (textStyles = []) => {
  const output = createTreeOfLeastDepth(
    textStyles,
    ['id'],
    token => ({ value: `${token.family}` })
  );

  return outputHelper('font', outputHelper('family', output));
}

module.exports = {
  mapTextStyleAssets,
};
