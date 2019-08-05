const camelcase = require('camelcase');

// const formatColor = require('./color');
const { tokenize, getCoordinatesFromStringPoint } = require('../../utils');

const BLUR_TYPES = new Map([
  [0, 'GAUSSIAN'],
  [1, 'MOTION'],
  [2, 'ZOOM'],
  [3, 'BACKGROUND'],
]);

module.exports = blur => {
  const type = BLUR_TYPES.get(blur.type);
  const [xCoord, yCoord] = getCoordinatesFromStringPoint(blur.center);

  return {
    id: camelcase(blur.id),
    token: tokenize('blur'),
    type,
    radius: blur.radius,
    saturation: blur.saturation,
    motionAngle: blur.motionAngle,
    ...(type === BLUR_TYPES.get(3) ? {
      center: {
        x: xCoord,
        y: yCoord,
      }
    } : {}),
  }
}
