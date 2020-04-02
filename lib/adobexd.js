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

function findArtboardByID(artboards, id) {
  const board = artboards.find(b => b.id === id.replace('artboard-', '')); 

  return board.artboard;
}

async function parseXDFile(xdFilePath, outputDir) {
  
  await unzipFile(xdFilePath, outputDir);

  const MANIFEST_FILEPATH = path.join(outputDir, 'manifest');
  const xdManifest = JSON.parse(await readFile(MANIFEST_FILEPATH));

  const tokenArtboards = ['primitives/color', 'primitives/blur', 'primitives/border', 'primitives/gradient', 'textstyle'];
  const tokenReferences = getReferencesFromManifest(xdManifest);
  const groupedTokenReferences = tokenArtboards.map(key => filterReferences(tokenReferences, key));

  const artboards = await getArtboardFiles(outputDir);

  const colorReferences = groupedTokenReferences.find(group => group.key === 'primitives/color').elements;
  const groupedColors = colorReferences.map(ref => {
    const artboard = findArtboardByID(artboards, ref.pathToToken);

    const colorName = artboard.children[0].name;
    const colorValue = artboard.children[0].group.children[0].style.fill.color.value;

    return { colorName, colorValue };
  });

  console.log(groupedColors)
  await removeDirectory(outputDir);

  return { xdManifest, artboards, groupedTokenReferences };
}

module.exports = parseXDFile;
