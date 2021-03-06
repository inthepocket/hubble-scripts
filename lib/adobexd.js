const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const { readFile, isDirectory, unzipFile, removeDirectory, uniqueArray } = require('./utils');

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

async function getTextStyles(outputDir) {
  const source = path.join(outputDir, 'resources', 'graphics', 'graphicContent.agc');
  const { documentLibrary } = JSON.parse(await readFile(source)).resources.meta.ux;

  return Array.isArray(documentLibrary.elements) ? documentLibrary.elements.filter(e => e.type.startsWith('application/vnd.adobe.element.characterstyle')) : [];
};

function getFonts(textStyles) {
  const fonts = textStyles.map(style => style.representations[0].content.postscriptName);

  return uniqueArray(fonts);
};

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
  const filteredElements = references.filter(element => element.name.replace('primitives/', '').startsWith(filter));

  return { key: filter, elements: filteredElements };
};

function findArtboardByID(artboards, id) {
  const board = artboards.find(b => b.id === id.replace('artboard-', ''));
  return board;
}

async function parseXDFile(xdFilePath, outputDir) {
  await unzipFile(xdFilePath, outputDir);

  const MANIFEST_FILEPATH = path.join(outputDir, 'manifest');
  const xdManifest = JSON.parse(await readFile(MANIFEST_FILEPATH));

  const tokenReferences = getReferencesFromManifest(xdManifest);
  const validTokens = tokenReferences.filter(ref => (ref.name.startsWith('primitives')));

  const tokenArtboards = ['color', 'blur', 'border', 'gradient', 'drop-shadow', 'grid'];
  const groupedTokenReferences = tokenArtboards.map(key => filterReferences(validTokens, key));

  const artboards = await getArtboardFiles(outputDir);

  const matchedTokens = groupedTokenReferences.map((tokenGroup, index) => tokenGroup.elements.map(ref => {
    const { name } = ref;

    let value = findArtboardByID(artboards, ref.pathToToken);
    if (tokenGroup.key === 'grid') {
      return { size: value.meta.ux.gridStyle.rowSpacing };
    } 

    [value] = value.artboard.children;

    const regex = new RegExp(`primitives/${tokenArtboards[index]}/`, 'gi');

    return {
      name: name.replace(regex, ''),
      value
    };
  }));

  const [colors, blurs, borders, gradients, shadows, grids] = matchedTokens;
  const textStyles = await getTextStyles(outputDir)

  await removeDirectory(outputDir);

  return {
    colors,
    blurs,
    borders,
    gradients,
    textStyles,
    shadows,
    grid: grids[0],
    fonts: getFonts(textStyles),
    version: xdManifest['manifest-format-version'],
  };
}

module.exports = parseXDFile;
