/* eslint-disable no-prototype-builtins */

/**
 * Get the color id from a valid color artboard name
 * @param {string} artboardName
 * @return {string}
 */
const getColorId = (artboardName) => {
  if (!artboardName.startsWith('primitives/color/')) {
    throw new Error(`
      Tried to find color id for ${artboardName} but it was not the correct format.
      When using color artboards, the artboard name needs to be of format: primitives/color/<colorId>

      Examples:
        primitives/color/primaryColor, primitives/color/primaryColor200, primitives/color/mainRed
    `);
  }

  const id = artboardName.replace('primitives/color/', '');
  const hasVariant = RegExp(/[0-9]+$/).test(id);

  return {
    id: hasVariant ? id.replace('/', '') : id,
    ...(hasVariant ? { variant: parseInt(id.match(/[0-9]+$/)[0], 0) }: {}),
  };
}
exports.getColorId = getColorId;

/**
 * Get an array of all pages in the sketch file
 * @param {Object} response sketch2json output
 * @return {Array<{layers, name, sketchId}>}
 */
exports.getPageArrays = (response) => Object.values(response.pages)
  .map(page => ({
    layers: page.layers,
    name: page.name,
    sketchId: page.do_objectID,
  }));

/**
 * Get a color type (like document colors) from artboards named 'primitives/colors/<color>'
 * @param {Array<Object>} layers layers from sketch2json output
 */
exports.getColorsFromArtboard = (layers) => layers
  .filter(layer => layer.name.startsWith('primitives/color/'))
  .map(layer => {
    const [colorArtboard] = layer.layers.map(color => {
      const [colorLayer] = color.style.fills.filter(fill => fill.hasOwnProperty('color'));
      return colorLayer.color
    });

    return {
      ...colorArtboard,
      ...getColorId(layer.name),
      _class: 'artboardColor',
    };
  });

/**
 * Get a gradient from artboards named 'primitives/gradient/<gradient>'
 * @param {Array<Object>} layers layers from sketch2json output
 */
exports.getGradientsFromArtboard = (layers) => layers
.filter(layer => layer.name.startsWith('primitives/gradient/'))
.map(layer => {
  const [gradientArtboard] = layer.layers.map(gradient => {
    const [gradientLayer] = gradient.style.fills.filter(fill => fill.hasOwnProperty('gradient'));
    return gradientLayer;
  });

  return gradientArtboard.gradient;
});

const getShadowType = (layers, type) => layers
.filter(layer => layer.name.startsWith(`primitives/${type}/`))
.map(layer => {
  const [shadowArtboard] = layer.layers.map(shadow => {
    const [shadowLayer] = type === 'drop-shadow'
      ? shadow.style.shadows
      : shadow.style.innerShadows;
    return shadowLayer;
  });

  return {
    type,
    ...shadowArtboard,
  };
});

exports.getShadowsFromArtboard = (layers) => {
  const inners = getShadowType(layers, 'inner-shadow');
  const drops = getShadowType(layers, 'drop-shadow');
  return [...inners, ...drops];
}
