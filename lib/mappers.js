const colorConvert = require('color-convert');
const colorNamer = require('color-namer');
const camelcase = require('camelcase');

const { convertNSColorToRGB } = require('./utils');

const formatColor = ({ red, green, blue, alpha }) => {
  const R = convertNSColorToRGB(red);
  const G = convertNSColorToRGB(green);
  const B = convertNSColorToRGB(blue);

  return {
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

module.exports = {
  formatColor,

  mapColors: colors => colors.map(formatColor),

  mapTextStyles: textStyles => textStyles.objects.map((stl) => {
    const attrs = stl.value.textStyle.encodedAttributes;

    return {
      id: stl.name,
      weight: null,
      size: attrs.MSAttributedStringFontAttribute.attributes.size,
      family: attrs.MSAttributedStringFontAttribute.attributes.name,
      borderBottom: attrs.underlineStyle || null,
      color: formatColor(attrs.MSAttributedStringColorAttribute),
      kerning: attrs.kerning || null,
    };
  }),

};
