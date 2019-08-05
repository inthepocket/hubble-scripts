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
 * Flattens a nested Figma API response recursively using flattenChildrenHelper.
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
exports.flattenChildren = flattenChildren;

/**
 * Finds specific tokens in the flattened Figma API response
 * @param {Object} data
 * @param {string} tokenType
 * @return {Array<Object>}
 */
exports.findAllTokens = (data, tokenType) =>
  data.filter(
    comp =>
      comp.name.toLowerCase().includes(tokenType.toLowerCase()) &&
      !comp.name
        .split('/')
        .pop()
        .toLowerCase()
        .includes(tokenType.toLowerCase()),
  );
