module.exports = {

  prettyJSON: json => JSON.stringify(json, null, 2),

  convertNSColorToRGB: color => (color * 255.99999).toFixed(),

};
