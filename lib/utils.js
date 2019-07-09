const camelcase = require('camelcase');
const colorConvert = require('color-convert');
const colorNamer = require('color-namer');
const fs = require('fs').promises;

const isArtboardColor = color => color._class === 'artboardColor';
exports.isArtboardColor = isArtboardColor;
exports.isDocumentColor = color =>
  color._class === 'color' || color._class === 'MSImmutableColorAsset';

module.exports = {
  /**
   * Format JSON to human readable output
   */
  prettyJSON: json => JSON.stringify(json, null, 2),

  /**
   * Convert an iOS/macOS NSCOlor to an RGB value (0-255)
   */
  convertNSColorToRGB: color => Number((color * 255).toFixed()),

  /**
   * Get only the unique results in an Array (shallow)
   */
  uniqueArray: arr => [...new Set(arr)],

  /**
   * Formats design tokens to standardised Hubble token names.
   * These tokens are kebab-cased
   */
  tokenize: token => token.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),

  /**
   * Generates a nice color name from an RGB array.
   */
  getNamedColorFromRGB: ([red, green, blue]) =>
    camelcase(colorNamer(`rgb(${red}, ${green}, ${blue})`).ntc[0].name),

  /**
   * Get the default line height (font size * 1.2) for font styles
   * missing a user-defined line height.
   */
  calculateDefaultLineHeight: fontAttrs => parseFloat((fontAttrs.size * 1.2).toFixed(2)),

  /**
   * Maps keys of a color object from r,g,b,a
   * to green, blue, red and alpha
   */
  mapColorKeys: colors => {
    const mapping = {
      r: 'red',
      g: 'green',
      b: 'blue',
      a: 'alpha',
    };
    return Object.keys(colors).reduce((acc, key) => {
      acc[mapping[key]] = colors[key];
      return acc;
    }, {});
  },

  /**
   * Return the font weight based from the font family
   * If the font family name does not contain a weight, return null
   * e.g Helvetica-Bold -> weight: 'bold' / Helvetica -> weight: null
   */
  getFontWeight: family => {
    const chunks = family.split('-');
    return chunks.length > 1 ? chunks[chunks.length - 1].toLowerCase() : null;
  },

  /**
   * Gets the extension of a given file
   */
  getExtension: file => file.split('.').pop(),

  /**
   * Formats the rgba values from a color nicely
   * @param {Object} color
   * @return {Object}
   */
  formatColor: color => {
    const { red, green, blue, alpha } = color;
    const R = module.exports.convertNSColorToRGB(red);
    const G = module.exports.convertNSColorToRGB(green);
    const B = module.exports.convertNSColorToRGB(blue);

    const computedColorName = module.exports.getNamedColorFromRGB([R, G, B]);

    return {
      token: module.exports.tokenize('color'),
      ...(isArtboardColor(color)
        ? { id: camelcase(color.id), variant: color.variant || null }
        : {}),
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
  },

  /**
   * Reads a file
   */
  readFile: async file => fs.readFile(file),
};
