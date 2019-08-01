const { createTreeOfLeastDepth, outputHelper } = require('./util');

/**
 *
 * Maps blurs of the given input to Style Dictionary compatible blurs.
 *
 * @param Array blurStyles: an array containting every blurLayer.
 * @returns Object: a StyleDictionary tree of type 'blur' that can containt different types.
 */
const mapBlurStyles = (blurStyles = []) => {
  const output = createTreeOfLeastDepth(blurStyles, ['type', 'token'], blur => {
    const { radius, motionAngle, saturation } = blur;
    return { radius, motionAngle, saturation };
  });
  return outputHelper('blur', output);
};

module.exports = {
  mapBlurStyles,
};
