const colorConvert = require('color-convert');

const { convertNSColorToRGB } = require('./utils');

module.exports = {

  mapColors: colors => colors.map(({ alpha, blue, green, red }) => {
    const r = convertNSColorToRGB(red);
    const g = convertNSColorToRGB(green);
    const b = convertNSColorToRGB(blue);

    return {
      red: r,
      green: g,
      blue: b,
      alpha,
      hex: colorConvert.rgb.hex(r, g, b, alpha),
      hsl: colorConvert.rgb.hsl(r, g, b),
    };
  }),

  mapTextStyles: textStyles => textStyles.objects.map((stl) => {
    const attrs = stl.value.textStyle.encodedAttributes;

    const r = convertNSColorToRGB(attrs.MSAttributedStringColorAttribute.red);
    const g = convertNSColorToRGB(attrs.MSAttributedStringColorAttribute.red);
    const b = convertNSColorToRGB(attrs.MSAttributedStringColorAttribute.red);
    const a = attrs.MSAttributedStringColorAttribute.alpha;

    return {
      id: stl.name,
      weight: null,
      size: attrs.MSAttributedStringFontAttribute.attributes.size,
      family: attrs.MSAttributedStringFontAttribute.attributes.name,
      borderBottom: attrs.underlineStyle || null,
      color: {
        hex: colorConvert.rgb.hex(r, g, b),
        rgba: [r, g, b, a],
        hsl: colorConvert.rgb.hsl(r, g, b),
      },
      kerning: attrs.kerning || null,
    };
  }),

};
