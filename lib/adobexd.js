const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const { readFile, isDirectory, unzipFile, removeDirectory } = require('./utils');

async function getArtboardFiles(outputDir) {
  const artboardSource = path.join(outputDir, 'artwork'); 
  const directoryContents = await promisify(fs.readdir)(artboardSource);

  const artboardDirs = directoryContents
    .map(name => path.join(artboardSource, name))
    .filter(isDirectory);
  
  const artboardFiles = await Promise.all(artboardDirs.map(directory => {
    const fileLocation = path.join(directory, 'graphics', 'graphicContent.agc');
    return readFile(fileLocation);
  }));

  // Only parse the first child, since we don't look at other children in an artboard
  const artboardObjects = artboardFiles.map(artboard => JSON.parse(artboard).children[0]);

  return artboardObjects;
}

function getReferencesFromManifest(manifest) {
  const elementReferences = manifest.children[0].children;

  // Only pick relevant object keys
  const mappedElements = elementReferences.map((referenceObject) => {
    const { id, name, ...partial} = referenceObject;
    const pathToToken = partial.path;

    return { id, name, pathToToken};
  });

  return mappedElements;
}

function filterReferences(references, filter) {
  const filteredElements = references.filter(element => element.name.startsWith(filter));

  return { key: filter, elements: filteredElements };
}

async function parseXDFile(xdFilePath, outputDir) {
  
  await unzipFile(xdFilePath, outputDir);

  const MANIFEST_FILEPATH = path.join(outputDir, 'manifest');
  const xdManifest = JSON.parse(await readFile(MANIFEST_FILEPATH));

  const artboards = await getArtboardFiles(outputDir);

  const tokenArtboards = ['primitives/color', 'primitives/blur', 'primitives/border', 'primitives/gradient', 'textstyle'];
  const tokenReferences = getReferencesFromManifest(xdManifest);
  const groupedTokenReferences = tokenArtboards.map(key => filterReferences(tokenReferences, key));

  removeDirectory(outputDir);

  return { xdManifest, artboards, groupedTokenReferences };
}

module.exports = parseXDFile;
