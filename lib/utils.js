const camelcase = require('camelcase');
const colorConvert = require('color-convert');
const colorNamer = require('color-namer');
const fs = require('fs');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const isArtboardColor = color => color._class === 'artboardColor';
exports.isArtboardColor = isArtboardColor;
exports.isDocumentColor = color =>
  color._class === 'color' || color._class === 'MSImmutableColorAsset';

/**
 * Generates a nice color name from an RGB array.
 */
const getNamedColorFromRGB = ([red, green, blue]) =>
  camelcase(colorNamer(`rgb(${red}, ${green}, ${blue})`).ntc[0].name);

/**
 * Convert an iOS/macOS NSCOlor to an RGB value (0-255)
 */
const convertNSColorToRGB = color => Number((color * 255).toFixed());

/**
 * Formats design tokens to standardised Hubble token names.
 * These tokens are kebab-cased
 */
const tokenize = token => token.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

module.exports = {
  /**
   * Format JSON to human readable output
   */
  prettyJSON: json => JSON.stringify(json, null, 2),

  /**
   * Get only the unique results in an Array (shallow)
   */
  uniqueArray: arr => [...new Set(arr)],

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
   * Formats the rgba values from a color nicely
   * @param {Object} color
   * @return {Object}
   */
  formatColor: color => {
    const { red, green, blue, alpha } = color;
    const R = convertNSColorToRGB(red);
    const G = convertNSColorToRGB(green);
    const B = convertNSColorToRGB(blue);

    const computedColorName = getNamedColorFromRGB([R, G, B]);

    return {
      token: tokenize('color'),
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
  readFile: async file => readFile(file),

  /**
   * Writes to a file
   */
  writeFile: async (location, contents) =>
    writeFile(location, contents, err => {
      if (err) {
        console.error('Error trying to write to file:', err); // eslint-disable-line no-console
        throw new Error(err);
      }
    }),

  /**
   * Tests a file for being a sketchfile
   * @param {string} filePath
   * @return {boolean}
   */
  isSketch: filePath => /.*\.sketch$/.test(filePath),

  /**
   * Get an object with an x,y coordinate from a string point
   * e.g '{0.5, 0.5}' -> { x: 0.5, y: 0.5 }
   */
  getCoordinatesFromStringPoint: stringPoint => {
    const coordinates = stringPoint.match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g);
    return coordinates ? coordinates.map(parseFloat) : [];
  },

  tokenize,
  convertNSColorToRGB,
  getNamedColorFromRGB,
};
