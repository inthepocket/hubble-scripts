const sampleOutput = require('../../../../__mocks__/figma/sample_dump.json');
const { flattenChildren, findTokens } = require('../../../figma');
const { uniqueArray } = require('../../../utils');

module.exports = () => {
  const response = flattenChildren(sampleOutput.document);

  return ({
    COLORS : findTokens(response, 'color'),
    GRADIENTS : findTokens(response, 'gradient'),
    TEXT_STYLES : findTokens(response, 'textstyle'),
    BORDERS : findTokens(response, 'border'),
    SHADOWS : findTokens(response, 'shadow'),
    FONTS: uniqueArray(
      findTokens(response, 'text').map(text => text.children[0].style.fontPostScriptName),
    )
  });
};
