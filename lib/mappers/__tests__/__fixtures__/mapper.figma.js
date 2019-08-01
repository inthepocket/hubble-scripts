const sampleOutput = require('../../../../__mocks__/figma/sample_dump.json');
const { flattenChildren, findAllTokens } = require('../../../figma');
const { uniqueArray } = require('../../../utils');

module.exports = () => {
  const response = flattenChildren(sampleOutput.document);

  return ({
    COLORS : findAllTokens(response, 'color'),
    GRADIENTS : findAllTokens(response, 'gradient'),
    TEXT_STYLES : findAllTokens(response, 'textstyle'),
    BORDERS : findAllTokens(response, 'border'),
    SHADOWS : findAllTokens(response, 'shadow'),
    FONTS: uniqueArray(
      findAllTokens(response, 'text').map(text => text.children[0].style.fontPostScriptName),
    )
  });
};
