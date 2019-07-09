const sampleOutput = require('../../../../__mocks__/sample_dump_figma.json');
const { figma2jsonFromJSON, findIds } = require('../../../figma');
const { uniqueArray } = require('../../../utils');

module.exports = () => {
  figma2jsonFromJSON(sampleOutput);
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