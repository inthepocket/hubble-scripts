const colorConvert = require('color-convert');
const camelcase = require('camelcase');

const { convertNSColorToRGB, tokenize, getNamedColorFromRGB } = require('../utils');

const isArtboardColor = (color) => color._class === 'artboardColor';
exports.isArtboardColor = isArtboardColor;
exports.isDocumentColor = (color) => color._class === 'color' || color._class === "MSImmutableColorAsset";

module.exports = (color) => {
  const { red, green, blue, alpha } = color;
  const R = convertNSColorToRGB(red);
  const G = convertNSColorToRGB(green);
  const B = convertNSColorToRGB(blue);

  const computedColorName = getNamedColorFromRGB([R, G, B]);

  return {
    token: tokenize('color'),
    ...(isArtboardColor(color) ? { id: camelcase(color.id), variant: color.variant || null } : {}),
    name: isArtboardColor(color) ? computedColorName : color.name || computedColorName,
    red: R,
    green: G,
    blue: B,
    alpha,
    rgb: [R, G, B],
    rgba: [R, G, B, alpha],
    hex: colorConvert.rgb.hex(R, G, B, alpha).toLowerCase(),
    hsl: colorConvert.rgb.hsl(R, G, B),
  };
};
