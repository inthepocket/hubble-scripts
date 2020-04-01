const fs  = require('fs');
const unzipper = require('unzipper');
const path = require('path')

const { readFile, isDirectory } = require('./utils');

exports.convertAdobeXDToZip = (inputPath, outputPath) => fs.createReadStream(inputPath).pipe(unzipper.Extract({ path: outputPath }))

exports.getArtboardFilesFromDir = async (source) => {
    const artboardSource = path.join(source, 'artwork');

    // Array of directories in the artwork folder
    const getDirectories = fs.readdirSync(artboardSource).map(name => path.join(artboardSource, name)).filter(isDirectory);

    // Read every .agc file in the subdirectories
    const artboardFiles = await Promise.all(getDirectories.map(directory => {
        const fileLocation = path.join(directory, 'graphics', 'graphicContent.agc');
        return readFile(fileLocation);
    }));

    // Parse result to JSON, only take the first child as it contains all the information
    const artboardFilesInJSON = artboardFiles.map(artboard => JSON.parse(artboard).children[0]);

    return artboardFilesInJSON;
}
