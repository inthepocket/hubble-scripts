const { tokenize } = require('../../utils');

function mapBlur(artboard) {
  return {
    id: artboard.name,
    type: artboard.name.toUpperCase(),
    token: tokenize('blur'),
    radius: artboard.value.style.filters[0].params.blurAmount,
    saturation: 1,
    motionAngle: 0,
  };
};

module.exports = mapBlur;
