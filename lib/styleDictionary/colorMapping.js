const {
  createTreeOfLeastDepth,
  getTypographicId,
  outputHelper,
  sortByProperty,
  uniqueArrayByProperty,
} = require('./util');

/**
 * Transforms the hex value of the ITP token to the '#000000' format.
 * Additionaly adds the given name of the color as a comment on the token.
 *
 * @param Object color: an ITP style token color value
 */
const mapColorToken = color => {
  const token = { value: `#${color.hex.toUpperCase()}` };

  if (color.name) {
    token.comment = color.name;
  }

  return token;
}

/**
 * Maps the colors of the given input textStyle ITP tokens to Style Dictionary compatible
 * color tokens.
 *
 * @param Array textStyles: an array of ITP style textStyle tokens
 * @returns Object: a StyleDictionary tree of type 'font' with 'color' items
 */
const mapTextStyleColors = (textStyles = []) => {
  const typographicElements = uniqueArrayByProperty(
    textStyles
      .filter(textStyle => textStyle.color)
      .map(({ color, id: textId }) => ({
        ...color,
        textId,
      })),
    'textId',
    getTypographicId
  ).sort(sortByProperty('textId'));

  const output = createTreeOfLeastDepth(
    typographicElements,
    ['textId'],
    mapColorToken
  );

  return outputHelper('font', output);
}

/**
 * Maps the colors of the given input borders ITP tokens to Style Dictionary compatible
 * color tokens.
 *
 * @param Array borderStyles: an array of ITP style borders tokens
 * @returns Object: a StyleDictionary tree of type 'border' with 'color' items
 */
const mapBorderStyleColors = (borderStyles = []) => {
  const output = createTreeOfLeastDepth(
    borderStyles
      .filter(borderStyle => borderStyle.color)
      .map(borderStyle => {
        const { color, id: borderId } = borderStyle;
        return Object.assign(color, { borderId });
      }
    ),
    ['borderId'],
    mapColorToken
  );

  return outputHelper('border', output);
}

/**
 * Maps the colors of the given input shadows ITP tokens to Style Dictionary compatible
 * color tokens.
 *
 * @param Array shadowStyles: an array of ITP style shadow tokens
 * @returns Object: a StyleDictionary tree of type 'shadow' with 'color' items
 */
const mapShadowStyleColors = (shadowStyles = []) => {
  const output = createTreeOfLeastDepth(
    shadowStyles
      .filter(shadowStyle => shadowStyle.color)
      .map(shadowStyle => {
        const { color, id : shadowId, type: shadowType } = shadowStyle;
        return Object.assign(color, { shadowId, shadowType});
      }
    ),
    ['shadowId', 'shadowType'],
    mapColorToken
  );

  return outputHelper('shadow', output);
}

/**
 * Maps the colors of the given input color ITP tokens to Style Dictionary compatible color
 * tokens.
 *
 * @param Array colors: an array of ITP style color tokens
 * @returns Object: a StyleDictionary tree of type 'base' with 'color' items.
 */
const mapBaseColors = (colors = []) => {
  const output = createTreeOfLeastDepth(
    colors,
    ['id', 'variant'],
    mapColorToken
  );

  return outputHelper('base', output);
}

module.exports = {
  mapTextStyleColors,
  mapBorderStyleColors,
  mapShadowStyleColors,
  mapBaseColors,
};
