const camelcase = require('camelcase');
const colorConvert = require('color-convert');
const colorNamer = require('color-namer');
const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');
const { promisify } = require('util');
const unzip = require('unzipper');
const rimraf = require('rimraf');

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

  uniqueArrayBy: (arr, prop) => arr.reduce((prev, curr) => {
    if (prev.find(i => i[prop] === curr[prop])) {
      return prev;
    };

    return [...prev, curr];
  }, []),

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

  unzipFile: function unzipFile(filePath, outputDir) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath, { emitClose: true })
        .pipe(unzip.Extract({ path: outputDir }))
        .on('error', reject)
        .on('close', resolve)
    });
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
   * Recursively delete a directory 
   * @deprecated node v12.10.0: use fs.rmdir(dir, { recursive: true })
   * @param {string} dir 
   */
  removeDirectory: dir => promisify(rimraf)(dir), 
    
  /**
   * Check if a given path is a directory
   * @param {string} dir
   * @return {boolean}
   */
  isDirectory: dir => fs.lstatSync(dir).isDirectory(),

  /**
   * Tests a file for being a sketchfile
   * @param {string} filePath
   * @return {boolean}
   */
  isSketch: filePath => /.*\.sketch$/.test(filePath),

  /**
   * Tests a file for being an adobexd file
   * @param {string} filePath
   * @return {boolean}
   */
  isAdobeXD: filePath => /.*\.xd$/.test(filePath), 

  /**
   * Get a tuple with x,y coordinate from a string point
   * e.g '{0.5, 0.5}' -> [0.5, 0.5]
   */
  getCoordinatesFromStringPoint: stringPoint => {
    if (typeof stringPoint !== 'string') {
      throw new TypeError(`
        getCoordinatesFromStringPoint only accepts points formatted as string
        e.g '{0.5, 0.5}'
      `)
    }

    const coordinates = stringPoint.match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g);
    return coordinates ? coordinates.map(parseFloat) : [];
  },

  /**
   * Downloads a file from a given url with a given name, and places it in the
   * downloadDir. If the fileName contains directories, it attempts to create these
   * in the downloadDir.
   */
  downloadFile: (downloadDir, { fileUrl, fileName }) => {
    const options = {
      host: url.parse(fileUrl).host,
      port: 80,
      path: url.parse(fileUrl).pathname
    };

    const fileDirStructure = fileName.split('/');
    if (fileDirStructure.length > 1) {
      const fileDir = path.join(downloadDir, fileDirStructure.slice(0, -1).join('/'));
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true })
      }
    }

    const file = fs.createWriteStream(path.join(downloadDir, fileName));

    http.get(options, (result) => {
      result
        .on('data', data => {
          file.write(data);
        })
        .on('end', () => {
          file.end();
        });
    });
  },

  /**
   * Snake case convertor implementation, by of https://github.com/huynhsamha
   */
  toSnakeCase: str => !str ? '' : String(str)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
    .replace(/([a-z])([A-Z])/g, (m, a, b) => `${a}_${b.toLowerCase()}`)
    .replace(/[^A-Za-z0-9]+|_+/g, '_')
    .toLowerCase()
  ,

  tokenize,
  convertNSColorToRGB,
  getNamedColorFromRGB,
};
