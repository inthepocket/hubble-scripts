const sampleOutput = require('../../../../__mocks__/figma/sample_dump.json');
const { figmaToTokens, findIds } = require('../../../figma');
const { uniqueArray } = require('../../../utils');

module.exports = () => {
  figmaToTokens(sampleOutput);
  return ({
    COLORS : findIds('color'),
    GRADIENTS : findIds('gradient'),
    TEXT_STYLES : findIds('textstyle'),
    BORDERS : findIds('border'),
    SHADOWS : findIds('shadow'),
    FONTS: uniqueArray(
      findIds('text').map(text => text.children[0].style.fontPostScriptName),
    )
  });
};
