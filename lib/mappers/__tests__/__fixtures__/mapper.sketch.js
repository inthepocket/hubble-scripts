const sampleOutput = require('../../../../__mocks__/sketch/sample_dump.json');
const {
  getPageArrays, getGradientsFromArtboard, getColorsFromArtboard, getShadowsFromArtboard,
  getBordersFromArtboard,
} = require('../../../sketch');

const PRIMITIVES_PAGE = getPageArrays(sampleOutput).find(i => i.name === 'primitives')

exports.PRIMITIVES_PAGE = PRIMITIVES_PAGE;

exports.DOCUMENT_COLORS = sampleOutput.document.assets.colorAssets
  .map(({ color, _class, name }) => ({ ...color, _class, name }));
exports.DOCUMENT_GRADIENTS = sampleOutput.document.assets.gradientAssets
  .map(({ gradient, _class }) => ({ ...gradient, _class }));;
exports.TEXT_STYLES = sampleOutput.document.layerTextStyles.objects;

exports.ARTBOARD_GRADIENTS = getGradientsFromArtboard(PRIMITIVES_PAGE.layers);
exports.ARTBOARD_SHADOWS = getShadowsFromArtboard(PRIMITIVES_PAGE.layers);
exports.ARTBOARD_COLORS = getColorsFromArtboard(PRIMITIVES_PAGE.layers);
exports.ARTBOARD_BORDERS = getBordersFromArtboard(PRIMITIVES_PAGE.layers);
