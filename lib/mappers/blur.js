const camelcase = require('camelcase');
const { tokenize } = require('../utils');

module.exports = blur => {
  const { radius, saturation, motionAngle } = blur;
  return {
    id: camelcase(blur.id),
    type: camelcase(blur.id),
    token: tokenize('blur'),
    radius,
    ...(blur.id.toLowerCase() === 'motion' && { angle: motionAngle.toFixed(2) }),
    ...(blur.id.toLowerCase() === 'background' && { saturation }),
  };
};
