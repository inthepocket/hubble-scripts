const colorConvert = require('color-convert');
const colorNamer = require('color-namer');
const camelcase = require('camelcase');

const { convertNSColorToRGB, tokenize } = require('../utils');

module.exports = ({ red, green, blue, alpha, _class, id, variant }) => {
  const R = convertNSColorToRGB(red);
  const G = convertNSColorToRGB(green);
  const B = convertNSColorToRGB(blue);

  return {
    token: tokenize('color'),
    ...(_class === 'artboardColor'? { id, variant: variant || null } : {}),
    name: camelcase(colorNamer(`rgb(${R}, ${G}, ${B})`).ntc[0].name),
    red: R,
    green: G,
    blue: B,
    alpha,
    rgb: `${R}, ${G}, ${B}`,
    rgba: `${R}, ${G}, ${B}, ${alpha}`,
    hex: colorConvert.rgb.hex(R, G, B, alpha).toLowerCase(),
    hsl: colorConvert.rgb.hsl(R, G, B),
  };
};
