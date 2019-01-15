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

};
