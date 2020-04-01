const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unzip = require('unzipper');

const { readFile, isDirectory } = require('./utils');

function unzipXDFile(filePath, outputDir) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath, { emitClose: true })
      .pipe(unzip.Extract({ path: outputDir }))
      .on('error', reject)
      .on('close', resolve)
  });
}

async function removeUnzippedXDFile(outputDir) {
  await promisify(fs.rmdir)(outputDir, { recursive: true });
}

async function getArtboardFiles(outputDir) {
  const artboardSource = path.join(outputDir, 'artwork'); 
  const directoryContents = await promisify(fs.readdir)(artboardSource);

  const artboardDirs = directoryContents
    .map(name => path.join(artboardSource, name))
    .filter(isDirectory); // enkel desired contents houden
  
  const artboardFiles = await Promise.all(artboardDirs.map(directory => {
    const fileLocation = path.join(directory, 'graphics', 'graphicContent.agc');
    return readFile(fileLocation);
  }));

  // Only parse the first child, since we don't look at other children in an artboard
  const artboardObjects = artboardFiles.map(artboard => JSON.parse(artboard).children[0]);

  return artboardObjects;
}

async function parseXDFile(xdFilePath, outputDir) {
  
  await unzipXDFile(xdFilePath, outputDir);

  const MANIFEST_FILEPATH = path.join(outputDir, 'manifest');
  const xdManifest = JSON.parse(await readFile(MANIFEST_FILEPATH));
  console.log('Name of the XD file, taken from the manifest:', xdManifest.name);

  const artboards = await getArtboardFiles(outputDir);
  console.log('Example of a parsed artboard:', artboards[0]);

  await removeUnzippedXDFile(outputDir);

  return { xdManifest, artboards };
}

module.exports = parseXDFile;
