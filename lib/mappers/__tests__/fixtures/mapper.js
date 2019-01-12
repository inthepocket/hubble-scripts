const sampleOutput = require('../../../../__mocks__/sample_dump.json');
const { getPageArrays, getGradientsFromArtboard } = require('../../../sketch');

const PRIMITIVES_PAGE = getPageArrays(sampleOutput).find(i => i.name === 'primitives')

exports.PRIMITIVES_PAGE = PRIMITIVES_PAGE;
exports.DOCUMENT_COLORS = sampleOutput.document.assets.colors;
exports.TEXT_STYLES = sampleOutput.document.layerTextStyles;
exports.ARTBOARD_GRADIENTS = getGradientsFromArtboard(PRIMITIVES_PAGE.layers);
