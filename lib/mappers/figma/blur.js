const camelcase = require('camelcase');

const { tokenize } = require('../../utils');

const BLUR_TYPES = new Map([
  ["LAYER_BLUR", "GAUSSIAN"],
  ["BACKGROUND_BLUR", "BACKGROUND"],
])

module.exports = blur => {
  const [blurLayer] = blur.children;
  const { radius, type } = blurLayer.effects[0];

  return {
    id: camelcase(blur.name.split('/').pop()),
    token: tokenize('blur'),
    type: BLUR_TYPES.get(type),
    radius,
    // The following properties are not settable in Figma
    saturation: 1,
    motionAngle: 0,
  }
};

