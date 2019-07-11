const Figma = require('figma-js');

/**
 * Helper function for flattenChildren
 * @param {Object} element a parent element
 * @param {Array<Object>} resultArray the array that will be returned at the end
 */
const flattenChildrenHelper = (element, resultArray) => {
  if (element.children) {
    element.children.forEach(child => {
      const clone = Object.assign({}, child);
      resultArray.push(clone);
      flattenChildrenHelper(child, resultArray);
    });
  }
};

/**
 * Flattens a nested Figma JSON file recursively using
 * flattenChildrenHelper.
 * @param {Object} element parent element of the JSON file
 * @return {Array<Object>}
 */
const flattenChildren = element => {
  const flattened = [];
  const clone = Object.assign({}, element);
  flattened.push(clone);
  element.children.forEach(child => {
    flattenChildrenHelper(child, flattened);
  });
  return flattened;
};

const data = (() => {
  let elements;
  return {
    setElements : (element) => {elements = flattenChildren(element)},
    getElements : () => elements
  };
})();

/**
 * Transforms a Figma formatted JSON object
 * to a standardized JSON object
 * and initializes the local variable 'elements'
 * @param {Object} file Figma formatted JSON file
 * @return {void}
 */
const figmaToTokens = json => {
  try {
    data.setElements(json.document);
    return json;
  } catch (err) {
    throw new Error('Failed reading file: ', err);
  }
};
exports.figmaToTokens = figmaToTokens;

/**
 * Returns a client to use the Figma API
 * @param {string} token user token
 * @return {Object}
 */
exports.getClient = personalAccessToken => Figma.Client({ personalAccessToken });

/**
 * Executes the API call by giving a valid fileId
 * and initializes the local variable 'elements'
 * @param {Object} client Figma client from figma-js package
 * @param {string} fileId id from Figma file
 * @return {void}
 */
exports.figma2jsonFromAPI = async (client, fileId) => {
  try {
    const response = await client.file(fileId);
    return figmaToTokens(response.data);
  } catch (err) {
    throw new Error('Failed getting file from Figma API: ', err);
  }
};

/**
 * Finds certain elements containing a keyword
 * @param {string} keyword
 * @param {Array<Object>} components
 * @return {Array<Object>}
 */
exports.findIds = keyword =>
  data.getElements().filter(comp => comp.name.toLowerCase().includes(keyword.toLowerCase()) && !comp.name.split('/').pop().toLowerCase().includes(keyword.toLowerCase()));
