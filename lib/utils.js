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

  getNamedColorFromRGB: ([red, green, blue]) =>
    camelcase(colorNamer(`rgb(${red}, ${green}, ${blue})`).ntc[0].name)
};
