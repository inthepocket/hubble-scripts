const sampleOutput = require('../../../../__mocks__/sample_dump_figma.json');
const { flattenChildren, findIds } = require('../../../figma');

const elements = flattenChildren(sampleOutput.document);

exports.COLORS = findIds('color', elements);
exports.GRADIENTS = findIds('gradient', elements);
exports.TEXT_STYLES = findIds('textstyle', elements);
exports.BORDERS = findIds('border', elements);
exports.SHADOWS = findIds('shadow', elements);

const set = new Set();
findIds('text', elements).forEach(text => {
  set.add(text.children[0].style.fontPostScriptName);
});
exports.FONTS = Array.from(set);