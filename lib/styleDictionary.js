

/**
 * Generates a style dictionary token for a color based on an ITP color token.
 *
 * @param Object color: an ITP style token color value, containing a hex value and
 *    optional name. We add this name to the comment attribute of the style dict token. 
 */
const mapColorToken = (color) => {
  const token = { value: `#${color.hex.toUpperCase()}` };
  if (color.name) {
    token.comment = color.name;
  }
  return token;
}

/**
 * Maps the colors of a given input of ITP tokens to Style Dictionary compatible color tokens.
 *
 * @param Object input: ITP tokens 
 */
const mapColors = (input) => {
  // Map colors from the colors property of the itp token input
  const colorsOutput = input.colors.reduce((acc, color) => {
    // Create first level of the identifier
    const id = color.variant ? color.id.replace(`${color.variant}`, '') : color.id;
    if (!acc[id]) {
      acc[id] = {};
    }

    // Map the actual token
    const token = mapColorToken(color);

    // Optional second level
    if (color.variant) {
      if (acc[id].value) {
        // This color already has a token assigned to it, but now a variant is encountered.
        // This happens if the first color consumed for this id does not have a variant,
        // because we then assume it to be the only color variantion for that id.
        acc[id] = { default: Object.assign({}, acc[id]) };
      }
      acc[id][color.variant] = token;
    } else if (Object.keys(acc[id]).length) {
      // There are variants for this id, but this color does not have a variant
      // defined. In other words, our token file contains a color called 'primary',
      // but also a color called 'primary900'. In this case, we save the first one
      // as primary.default
      acc[id].default = token;
    } else {
      acc[id] = token;
    }

    return acc;
  }, {});

  const output = input.textStyles
    ? input.textStyles.reduce((acc, textStyle) => {
      if (textStyle.color) {
        const token = mapColorToken(textStyle.color);

        if (!acc.font) {
          acc.font = {};
        }

        acc.font[textStyle.id] = token;
      }

      return acc;
    }, colorsOutput)
    : colorsOutput;

  return output;
};

exports.mapToStyleDictionaryTokens = (input) => {
  const output = {};

  const colorOutput = mapColors(input);
  if (colorOutput) {
    output.color = colorOutput;
  }

  return output;
};
