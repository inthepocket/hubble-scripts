const sampleOutput = require('../../../../__mocks__/figma/sample_dump.json');
const { figmaToTokens, findTokens } = require('../../../figma');
const { uniqueArray } = require('../../../utils');

module.exports = () => {
  figmaToTokens(sampleOutput);
  return ({
    COLORS : findTokens('color'),
    GRADIENTS : findTokens('gradient'),
    TEXT_STYLES : findTokens('textstyle'),
    BORDERS : findTokens('border'),
    SHADOWS : findTokens('shadow'),
    FONTS: uniqueArray(
      findTokens('text').map(text => text.children[0].style.fontPostScriptName),
    )
  });
};
