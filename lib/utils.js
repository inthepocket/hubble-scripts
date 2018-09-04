module.exports = {

  prettyJSON: json => JSON.stringify(json, null, 2),

  convertNSColorToRGB: color => Number((color * 255).toFixed()),

};
