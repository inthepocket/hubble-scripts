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

  return board.artboard.children[0];
}

async function parseXDFile(xdFilePath, outputDir) {
  await unzipFile(xdFilePath, outputDir);

  const MANIFEST_FILEPATH = path.join(outputDir, 'manifest');
  const xdManifest = JSON.parse(await readFile(MANIFEST_FILEPATH));

  const tokenArtboards = ['primitives/color', 'primitives/blur', 'primitives/border', 'primitives/gradient', 'textstyle'];
  const tokenReferences = getReferencesFromManifest(xdManifest);
  const groupedTokenReferences = tokenArtboards.map(key => filterReferences(tokenReferences, key));

  const artboards = await getArtboardFiles(outputDir);

  const matchedTokens = groupedTokenReferences.map(tokenGroup => tokenGroup.elements.map(ref => {
    const artboard = findArtboardByID(artboards, ref.pathToToken);

    const { name } = ref;
    const value = artboard; 

    return { name, value };
  }));

  let [colors, blurs, borders, gradients, textStyles] = matchedTokens;

  colors = colors.map(color => ({ ...color, value: color.value.group.children[0].style.fill.color.value }));
  blurs = blurs.map(blur => ({ ...blur, value: blur.value })); 
  borders = borders.map(border => ({ ...border, value: border.value.style.stroke }));
  gradients = gradients.map(gradient => ({ ...gradient, value: gradient.value.style.fill.gradient }));
  textStyles = textStyles.map(textStyle => ({ ...textStyle, value: textStyle.value.meta.ux.rangedStyles[0] }));

  await removeDirectory(outputDir);

  return { colors, blurs, borders, gradients, textStyles };
}

module.exports = parseXDFile;
