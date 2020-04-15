const camelcase = require('camelcase');

const { tokenize } = require('../../utils');

function mapBlur(artboard) {
  const { params } = artboard.value.style.filters[0];

  return {
    id: camelcase(artboard.name),
    type: params.backgroundEffect ? 'BACKGROUND' : 'GAUSSIAN',
    token: tokenize('blur'),
    radius: params.blurAmount,
    saturation: params.fillOpacity,
    motionAngle: 0,
  };
};

module.exports = mapBlur;
