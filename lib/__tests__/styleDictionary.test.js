const { mapToStyleDictionaryTokens } = require('../styleDictionary');
const sample = require('../../__mocks__/sample_output.json');

const inputColors = [
  {
    token: "color",
    id: "primary900",
    variant: 900,
    name: "seagull",
    red: 95,
    green: 194,
    blue: 230,
    alpha: 1,
    rgb: [95, 194, 230],
    rgba: [95, 194, 230, 1],
    hex: "5fc2e6",
    hsl: [196, 73, 64]
  },
  {
    token: "color",
    id: "primary800",
    variant: 800,
    name: "viking",
    red: 94,
    green: 193,
    blue: 209,
    alpha: 1,
    rgb: [94, 193, 209],
    rgba: [94, 193, 209, 1],
    hex: "5ec1d1",
    hsl: [188, 56, 59]
  },
  {
    token: "color",
    id: "secondary900",
    variant: 900,
    name: "salem",
    red: 34,
    green: 125,
    blue: 62,
    alpha: 1,
    rgb: [34, 125, 62],
    rgba: [34, 125, 62, 1],
    hex: "227d3e",
    hsl: [138, 57, 31]
  },
];

const outputColors = {
  primary: {
    900: { value: '#5FC2E6', comment: 'seagull' },
    800: { value: '#5EC1D1', comment: 'viking' },
  },
  secondary: {
    900: { value: '#227D3E', comment: 'salem' },
  },
};

const inputTextStyles = [
  {
    token: "text-style",
    id: "heading1",
    weight: null,
    size: 48,
    family: "FiraSans-Regular",
    borderBottom: null,
    color: {
      token: "color",
      name: "ultramarine",
      red: 16,
      green: 6,
      blue: 159,
      alpha: 1,
      rgb: [16, 6, 159],
      rgba: [16, 6, 159, 1],
      hex: "10069f",
      hsl: [244, 93, 32]
    },
    kerning: null
  },
  {
    token: "text-style",
    id: "heading2",
    weight: null,
    size: 36,
    family: "FiraSans-Regular",
    borderBottom: null,
    color: {
      token: "color",
      name: "ultramarine",
      red: 16,
      green: 6,
      blue: 159,
      alpha: 1,
      rgb: [16, 6, 159],
      rgba: [16, 6, 159, 1],
      hex: "10069f",
      hsl: [244, 93, 32]
    },
    kerning: null
  }
];

const outputTextStyles = {
  font: {
    heading1: { value: '#10069F', comment: 'ultramarine' },
    heading2: { value: '#10069F', comment: 'ultramarine' },
  },
}

const expectedColorOutputFromSample = {
  color: {
    primary: {
      900: { value: '#5FC2E6', comment: 'seagull' },
      800: { value: '#5EC1D1', comment: 'viking' },
      700: { value: '#77C8D6', comment: 'viking' },
      600: { value: '#8DCFDB', comment: 'halfBaked' },
      500: { value: '#A0D6E0', comment: 'powderBlue' },
      400: { value: '#B3DDE6', comment: 'powderBlue' },
      300: { value: '#D4EBF0', comment: 'pattensBlue' },
      200: { value: '#E5F3FA', comment: 'solitude' },
      100: { value: '#F2F9FD', comment: 'aliceBlue' },
    },
    secondary: {
      900: { value: '#227D3E', comment: 'salem' },
      800: { value: '#3E874A', comment: 'seaGreen' },
      700: { value: '#559158', comment: 'hippieGreen' },
      600: { value: '#6B9D6A', comment: 'aquaForest' },
      500: { value: '#81A97C', comment: 'amulet' },
      400: { value: '#97B690', comment: 'norway' },
      300: { value: '#C0D2BA', comment: 'paleLeaf' },
      200: { value: '#D4E0D0', comment: 'tasman' },
      100: { value: '#E9EFE7', comment: 'grayNurse' },
    },
    red: { value: '#F55E5E', comment: 'carnation' },
    font: {
      heading1: { value: '#10069F', comment: 'ultramarine' },
      heading2: { value: '#10069F', comment: 'ultramarine' },
      paragraph: { value: '#000000', comment: 'black' },
    },
  },
};

describe('[styleDictionary.js] test suite', () => {
  describe('-> #mapColors', () => {
    it('should map colors', () => {
      const mapping = mapToStyleDictionaryTokens({ colors: inputColors });

      expect(mapping).toBeDefined();
      expect(mapping).toEqual({ color: outputColors });
    });

    it('should map text colors alongside regular colors', () => {
      const mapping = mapToStyleDictionaryTokens({
        colors: inputColors,
        textStyles: inputTextStyles,
      });

      expect(mapping).toBeDefined();
      expect(mapping).toEqual({
        color: {
          primary: outputColors.primary,
          secondary: outputColors.secondary,
          font: outputTextStyles.font,
        },
      });
    });

    it('should map all the colors correctly from the sample output file', () => {
      const mapping = mapToStyleDictionaryTokens({
        colors: sample.colors,
        textStyles: sample.textStyles,
      });
      
      expect(mapping).toEqual(expectedColorOutputFromSample);
    });
  });
});
