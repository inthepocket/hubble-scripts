const sketch2json = require('sketch2json');
const {getClient, figma2json, findIds, flattenChildren} = require('../figma');
const {
    getPageArrays, getColorsFromArtboard, getGradientsFromArtboard, getShadowsFromArtboard,
    getBordersFromArtboard
  } = require('../../lib/sketch');

const getFileContents = require('../reader');

const getFileExtension = (file) => file.split('.').pop();
exports.getFileExtension = getFileExtension;

module.exports = async (args, flags) => {
  const file = args[0];
  const regex = /.*sketch/;
  if(regex.test(file)){
      // file is sketchfile
      try {
        const response = await sketch2json(await getFileContents(file));
        const primitivesPage = getPageArrays(response).find(i => i.name.toLowerCase() === 'primitives');
        if (!primitivesPage) {
          throw new Error(`No primitives page found.`)
        }

        module.getColors = () => flags.useColorArtboards
          ?  getColorsFromArtboard(primitivesPage.layers) 
          :  response.document.assets.colorAssets
              .map(({ color, _class, name }) => ({ ...color, _class, name }));

        module.getGradients = () => flags.useGradientArtboards
            ? getGradientsFromArtboard(primitivesPage.layers)
            : response.document.assets.gradientAssets
                .map(({ gradient, _class }) => ({ ...gradient, _class }));
        
        module.getTextStyles = () => response.document.layerTextStyles;
        module.getShadows = () => getShadowsFromArtboard(primitivesPage.layers);
        module.getBorders = () => getBordersFromArtboard(primitivesPage.layers);
        module.getFonts = () => response.meta.fonts;
        module.getVersion = () => ({sketchVersion: response.meta.appVersion});

        return ({parser: module, response});
      } catch(err){
        throw new Error(err);
      }
  }
  // file is figmafile
  const [fileId, token] = args;
  const client = getClient(token);
  const response = await figma2json(client, fileId);
  try {
      const elements = flattenChildren(response.data.document);

      module.getColors =  () => findIds('color', elements);
      module.getTextStyles = () => findIds('textstyle', elements);
      module.getFonts = () => {
          const set = new Set();
          findIds('text', elements).forEach(text => {
              set.add(text.children[0].style.fontPostScriptName);
          });
          return Array.from(set);
      };
      module.getGradients = () =>  findIds('gradient', elements);
      module.getShadows = () =>  findIds('shadow', elements);
      module.getBorders = () => findIds('border', elements);
      module.getVersion = () => null; // version not specified in figma

      return ({parser: module, response: response.data});
    } catch(err){
      throw new Error(err);
    }    
}
