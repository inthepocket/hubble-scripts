const fs = require('fs');
const unzipper = require('unzipper');

exports.convertAdobeXDToZip = (inputPath, outputPath) => fs.createReadStream(inputPath).pipe(unzipper.Extract({ path: outputPath }))

