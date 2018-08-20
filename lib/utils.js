module.exports = {

  prettyJSON: json => JSON.stringify(json, null, 2),

  convertNSColorToRGB: color => (color * 255).toFixed(),

};
