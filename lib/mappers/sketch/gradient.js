/* eslint-disable no-underscore-dangle */
const camelcase = require('camelcase');

const formatColor = require('./color');
const { tokenize, getNamedColorFromRGB, getCoordinatesFromStringPoint } = require('../../utils');

const GRADIENT_TYPES = ['LINEAR', 'RADIAL', 'ANGULAR'];

const isArtboardGradient = gradient => gradient._class === 'artboardGradient';
exports.isArtboardGradient = isArtboardGradient;
exports.isDocumentGradient = gradient =>
  gradient._class === 'gradient' || gradient._class === 'MSImmutableGradientAsset';

module.exports = gradient => {
  const { gradientType, from, to, stops } = gradient;

  const computedColorName = getNamedColorFromRGB(formatColor(stops[0].color).rgb);

  return {
    ...(isArtboardGradient(gradient)
      ? { id: camelcase(gradient.id) || null }
      : { name: gradient.name || `${computedColorName}Gradient` }),
    token: tokenize('gradient'),
    type: GRADIENT_TYPES[gradientType],
    from: getCoordinatesFromStringPoint(from),
    to: getCoordinatesFromStringPoint(to),
    stops: stops.map(({ position, color }) => ({
      position,
      color: formatColor(color),
    })),
  };
};
