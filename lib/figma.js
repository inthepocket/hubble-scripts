const Figma = require('figma-js');
const camelcase = require('camelcase');
const {getId, getVariant, mapColorKeys, tokenize} = require('./utils');
const {getTextStyle} = require ('./mappers/figma/textstyle');

module.exports =  {
    /**
     * Returns a client to use the Figma API
     * @param {string} token user token 
     * @return {Object} 
     */
    getClient: (token) => Figma.Client({personalAccessToken: token}),

    /**
     * Executes the API call by giving a valid fileId
     * @param {Object} client Figma client from figma-js package
     * @param {string} fileId id from Figma file
     * @return {Object}
     */
    figma2json: async(client, fileId) => {
        try {
            const response = await client.file(fileId);
            return response;
        } catch(err){
            throw new Error('Failed getting file: ', err);
        }
    },

    /**
     * Finds certain elements containing a keyword 
     * @param {string} keyword 
     * @param {Array<Object>} components
     * @return {Array<Object>}
     */
    findIds: (keyword, components) => components
        .filter(comp => comp.name.toLowerCase().includes(keyword.toLowerCase())),
    
    /**
     * Flattens a nested Figma JSON file recursively using 
     * flattenChildrenHelper. 
     * @param {Object} element parent element of the JSON file
     * @return {Array<Object>}
     */
    flattenChildren: (element) => {
        const flattened = [];
        const clone = Object.assign({}, element);
        flattened.push(clone);
        element.children.forEach(child => {
            module.exports.flattenChildrenHelper(child, flattened);
        })
        return flattened;
    },
    
    /**
     * Helper function for flattenChildren
     * @param {Object} element a parent element
     * @param {Arrat<Object>} resultArray the array that will be returned at the end
     */
    flattenChildrenHelper: (element, resultArray) => {
        if(element.children){
            element.children.forEach(child => {
                const clone = Object.assign({}, child);
                resultArray.push(clone);
                module.exports.flattenChildrenHelper(child, resultArray);
            });
        }
    }
}
