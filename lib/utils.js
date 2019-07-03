const camelcase = require('camelcase');
const colorNamer = require('color-namer');

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
  calculateDefaultLineHeight: (fontAttrs) => parseFloat((fontAttrs.size * 1.2).toFixed(2)),

  /**
   * Maps keys of a color object from g,b,r,a 
   * to green, blue, red and alpha
   */
  mapColorKeys: (colors) => {
    const mapping = {
      g: 'green',
      b: 'blue',
      r: 'red',
      a: 'alpha'
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
  getFontWeight: (family) => {
    const chunks = family.split('-');
    return chunks.length > 1
      ? chunks[chunks.length -1].toLowerCase()
      : null;
  }
};
