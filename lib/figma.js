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

/**
 * Parses a flattened Figma API response to get all necessary information
 * to call the Figma client and receive the image urls.
 *
 * @param {Array<Object>} exportableData
 * @return {Array<Object>}
 */
const parseImageRequestData = (exportableData) =>
  exportableData.reduce((acc, component) => {
      component.exportSettings.forEach((setting) => {
        const { suffix } = setting;
        const format = setting.format.toLowerCase();
        let scale = 1;
        if (setting.constraint && setting.constraint.type && setting.constraint.type === 'SCALE') {
          scale = setting.constraint.value;
        }

        const existingElement = acc.find(c => c.format === format && c.scale === scale);
        if (existingElement) {
          existingElement.ids.push(component.id);
        } else {
          acc.push({
            ids: [component.id],
            format,
            scale,
            suffix,
          })
        }
      });
      return acc;
    }, []);

/**
 * Calls the images endpoint of the figma api (using figma-js client).
 * This call returns an images map where each key is an object id, and each
 * value is a url of the image in the requested format.
 * See https://www.figma.com/developers/api#get-images-endpoint for more info
 *
 * @param {Object} client
 * @param {string} fileId
 * @param {Object} imageRequest
 * @return {Object}
 */
const getImageUrls = async (client, fileId, imageRequest) => {
  const imageResponse = await client.fileImages(fileId, imageRequest);
  return {
    format: imageRequest.format,
    suffix: imageRequest.suffix,
    urls: Object.entries(imageResponse.data.images).map(([id, url]) => ({ id, url })),
  };
};

/**
 * Retrieves the urls for all images-exportsetting combinations defined in the (flattened)
 * figma api response. Returns a map of url, id and full filename (including suffix and extension)
 *
 * @param {Object} client
 * @param {string} fileId
 * @param {Array<Object>} data
 * @return {Array<Object>}
 */
exports.retrieveImageUrls = async(client, file, data) => {
  try {
    // filter out only components containing exportSettings
    const exportableData = data.filter(component => component.exportSettings);

    // Parse all necessary data for the images request to figma api
    const imageRequestData = parseImageRequestData(exportableData);

    // Request the image urls for each image-exportsetting combination
    const imageRequestResults = await Promise.all(imageRequestData
      .map(imageRequest => getImageUrls(client, file, imageRequest))
    );

    // Now create an array of objects containing the full desired filename and url.
    return imageRequestResults.reduce((acc, result) => {
      result.urls.forEach(({ id, url }) => {
        const matchingFileData = exportableData.find(d => d.id === id);
        acc.push({
          id,
          fileUrl: url,
          fileName: `${matchingFileData.name}${result.suffix}.${result.format}`,
        });
      });
      return acc;
    }, []);
  } catch (e) {
    // TODO: Create documentation page for images in Figma files and use the correct link below
    // TODO: Perhaps use more granular error messaging, and make some of them non-critical. Other design token
    // export can complete without images
    throw new Error(`
      Something went wrong while trying to retrieve the images marked as exportable in Figma!
      Please see https://github.com/inthepocket/hubble-sketch-plugin/wiki on how to structure your Figma file.
    `);
  }
}
