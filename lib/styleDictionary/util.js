const camelCase = require('camelcase');

/**
 * Simple utility function to either wrap the given output object in an object
 * as a prop with key 'propKey', or return an empty object. Usefull to create
 * the desired CTI output of Style Dictionary.
 *
 * @param String propKey: key in which the output should be wrapped
 * @param Object obj: object to wrap
 */
const outputHelper = (propKey, obj) => {
  const output = {};

  if (Object.keys(obj).length > 0) {
    output[propKey] = obj;
  }

  return output;
}

/**
 * Creates a tree following Style Dictionary's CTI principle of the least possible depth.
 * Check the unit tests in styleDictionary.test.js for concrete examples.
 *
 * For each identifier:
 * Check all inputTokens, group them by identifier.
 * If only one inputToken for this identifier, run tokenConverter on it.
 * If several:
 *    - go to next identifier
 *    - recursively start grouping again, until one remains
 *    - if grouping, but one token does not have the identifier, run tokenConverter on it as 'default'
 *    - if several tokens do not have identifier, add it with a key consisting of the missing
 *      identifier + an incrementing suffix
 *
 * @param Array inputTokens: An array of ITP style design tokens
 * @param Array identifiers: An array of strings, representing the keys to group the tokens by,
 *                           in order.
 * @param Function tokenConverter: A transformer function which will be run on the token once
 *                                 it's correct location in the tree is determined.
 * @returns A tree of tokens according to the CTI principle
 */
const createTreeOfLeastDepth = (inputTokens, identifiers, tokenConverter) => {
  const DEFAULT_KEY = 'default';

  const tokenGroupsByIdentifier = inputTokens.reduce((acc, inputToken) => {
    let key = inputToken[identifiers[0]];

    if (!key) {
      if (acc[DEFAULT_KEY]) {
        const suffix = Object.keys(acc).filter(accKey => accKey.startsWith(identifiers[0])).length + 1;
        key = `${identifiers[0]}${suffix}`
      } else {
        key = DEFAULT_KEY;
      }
    }

    key = camelCase(`${key}`);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(inputToken);

    return acc;
  }, {});

  return Object.keys(tokenGroupsByIdentifier).reduce((acc, tokenGroupKey) => {
    const tokenGroup = tokenGroupsByIdentifier[tokenGroupKey];
    if (tokenGroup.length > 1) {
      acc[tokenGroupKey] = createTreeOfLeastDepth(tokenGroup, identifiers.slice(1), tokenConverter);
    } else {
      acc[tokenGroupKey] = tokenConverter(tokenGroup[0]);
    }

    return acc;
  }, {});
};

/**
 * Strips typographic id from design id
 * e.g. header1/Left/Neutral/100 ==> header1
 */
const getTypographicId = id => id.split('/')[0];

/**
 * Removes duplicates from array of objects based on property value
 */
const uniqueArrayByProperty = (collection, property, processKeyName) => [
  ...new Map(collection.map(element => {
    const key = typeof processKeyName === 'function' ?
      processKeyName(element[property]) : element[property];

    return [key, {
      ...element,
      [property]: key,
    }];
  })).values()
];

/**
 * Sorts array of objects by property
 * usage: array.sort(sortByProperty('id'));
 */
const sortByProperty = property => (a, b) =>
  (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0); // eslint-disable-line no-nested-ternary

module.exports = {
  createTreeOfLeastDepth,
  getTypographicId,
  outputHelper,
  sortByProperty,
  uniqueArrayByProperty,
};
