const mapToStyleDictionaryTokens = require('../styleDictionary');
const { createTreeOfLeastDepth } = require('../styleDictionary/util');

const reusableColors = [
  {
    input: {
      token: "color",
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
    output: { value: '#5FC2E6', comment: 'seagull' },
  },
  {
    input: {
      token: "color",
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
    output: { value: '#5EC1D1', comment: 'viking' },
  },
];

describe('[styleDictionary.js] test suite', () => {
  const inputTextStyles = [
    {
      token: "text-style",
      id: "heading1",
      weight: null,
      size: 48,
      family: "FiraSans-Regular",
      borderBottom: null,
      color: reusableColors[0].input,
      kerning: null
    },
    {
      token: "text-style",
      id: "heading2",
      weight: null,
      size: 36,
      family: "FiraSans-Regular",
      borderBottom: null,
      color: reusableColors[1].input,
      kerning: null
    },
  ];
  
  const outputTextStyles = {
    color: {
      font: {
        heading1: reusableColors[0].output,
        heading2: reusableColors[1].output,
      },
    },
    size: {
      font: {
        heading1: { value: '48' },
        heading2: { value: '36' },
      },
    },
    asset: {
      font: {
        family: {
          heading1: { value: 'FiraSans-Regular' },
          heading2: { value: 'FiraSans-Regular' },
        },
      },
    },
  };

  describe('-> #mapColors', () => {
    const inputColors = [
      Object.assign(
        { id: "primary900", variant: 900 },
        reusableColors[0].input
      ),
      Object.assign(
        { id: "primary800", variant: 800 },
        reusableColors[1].input
      ),
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
      base: {
        primary900: reusableColors[0].output,
        primary800: reusableColors[1].output,
        secondary900: { value: '#227D3E', comment: 'salem' },
      }
    };

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
      expect(mapping).toHaveProperty( 'color', {
        base: outputColors.base,
        font: outputTextStyles.color.font,
      });
    });

    it('should map a color to the id itself for an ITP color token without variant', () => {
      const mapping = mapToStyleDictionaryTokens({
        colors: [{
          token: "color",
          id: "primary",
          name: "seagull",
          hex: "5fc2e6",
        }],
      });

      expect(mapping).toEqual({
        color: {
          base: {
            primary: { value: '#5FC2E6', comment: 'seagull' },
          }
        },
      });
    });

    it('should map a color to a default key for an ITP color token without variant but a sibling with a variant', () => {
      const mapping = mapToStyleDictionaryTokens({
        colors: [
          {
            token: "color",
            id: "primary",
            name: "seagull",
            hex: "5fc2e6",
          },
          {
            token: "color",
            id: "primary",
            variant: 800,
            name: "viking",
            hex: "5ec1d1",
          },
        ],
      });

      expect(mapping).toEqual({
        color: {
          base: {
            primary: {
              default: { value: '#5FC2E6', comment: 'seagull' },
              800: { value: '#5EC1D1', comment: 'viking' },
            }
          },
        },
      });
    });
  });

  describe('-> #mapText', () => {
    it('should map text sizes', () => {
      const mapping = mapToStyleDictionaryTokens({ textStyles: inputTextStyles });

      expect(mapping).toBeDefined();
      expect(mapping).toHaveProperty('size.font', outputTextStyles.size.font);
    });

    it('should map text assets', () => {
      const mapping = mapToStyleDictionaryTokens({ textStyles: inputTextStyles });

      expect(mapping).toBeDefined();
      expect(mapping).toHaveProperty('asset.font', outputTextStyles.asset.font);
    });

    it('should map text colors', () => {
      const mapping = mapToStyleDictionaryTokens({ textStyles: inputTextStyles });

      expect(mapping).toBeDefined();
      expect(mapping).toHaveProperty( 'color.font', outputTextStyles.color.font);
    });
  });

  describe('-> #mapBorders', () => {
    const inputBorderStyles = [
      {
        id: 'inside',
        token: 'border',
        color: reusableColors[0].input,
        width: 1,
        type: 'INSIDE',
        radius: 3
      },
      {
        id: 'outside',
        token: 'border',
        color: reusableColors[1].input,
        width: 2,
        type: 'OUTSIDE',
        radius: 12.5
      },
    ];
    
    const outputBorderStyles = {
      color: {
        border: {
          inside: reusableColors[0].output,
          outside: reusableColors[1].output,
        }
      },
      size: {
        border: {
          inside: { value: '1' },
          outside: { value: '2' },
        },
      },
    };

    it('should map border sizes', () => {
      const mapping = mapToStyleDictionaryTokens({ borders: inputBorderStyles });

      expect(mapping).toBeDefined();
      expect(mapping).toHaveProperty('size.border', outputBorderStyles.size.border);
    });

    it('should map border colors', () => {
      const mapping = mapToStyleDictionaryTokens({ borders: inputBorderStyles });

      expect(mapping).toBeDefined();
      expect(mapping).toHaveProperty('color.border', outputBorderStyles.color.border);
    });
  });

  describe('-> #mapShadows', () => {
    const inputShadowStyles = [
      {
        id: 'simple',
        token: 'shadow',
        blur: 3,
        x: 0,
        y: 1,
        spread: 0,
        type: 'inner-shadow',
        color: reusableColors[0].input,
      },
      {
        id: 'simple',
        token: 'shadow',
        blur: 4,
        x: 0,
        y: 2,
        spread: 5,
        type: 'drop-shadow',
        color: reusableColors[1].input,
      },
    ];

    const outputShadowStyles = {
      color: {
        shadow: {
          simple: {
            innerShadow: reusableColors[0].output,
            dropShadow: reusableColors[1].output,
          }
        }
      }
    }

    it('should map shadow colors', () => {
      const mapping = mapToStyleDictionaryTokens({ shadows: inputShadowStyles });

      expect(mapping).toBeDefined();
      expect(mapping).toHaveProperty('color.shadow', outputShadowStyles.color.shadow);
    });
  });

  describe('sample output file mapping', () => {
    it('should correctly map the __mocks__/sample_output.json file', () => {
      
    });
  });

  describe('-> #createTreeOfLeastDepth', () => {
    it ('should correctly map a simple structure of a single level', () => {
      const result = createTreeOfLeastDepth(
        [
          { id: 'first', color: 'red' },
          { id: 'second', color: 'blue' },
          { id: 'third', color: 'green' }
        ],
        ['id'],
        (val) => ({ value: val.color }),
      );

      expect(result).toBeDefined();
      expect(result).toEqual({
        first: { value: 'red' },
        second: { value: 'blue' },
        third: { value: 'green' },
      });
    });

    it ('should correctly map a simple structure of two levels', () => {
      const result = createTreeOfLeastDepth(
        [
          { id: 'first', variant: 'base', color: 'red' },
          { id: 'first', variant: 'lighter', color: 'light-red' },
          { id: 'first', variant: 'darker', color: 'dark-red' },
          { id: 'second', color: 'blue' },
          { id: 'third', color: 'green' }
        ],
        ['id', 'variant'],
        (val) => ({ value: val.color }),
      );

      expect(result).toEqual({
        first: {
          base: { value: 'red' },
          lighter: { value: 'light-red' },
          darker: { value: 'dark-red' },
        },
        second: { value: 'blue' },
        third: { value: 'green' },
      });
    });

    it ('should add default value for single missing key', () => {
      const result = createTreeOfLeastDepth(
        [
          { id: 'first', color: 'red' },
          { id: 'first', variant: 'lighter', color: 'light-red' },
          { id: 'first', variant: 'darker', color: 'dark-red' },
          { id: 'second', color: 'blue' },
          { id: 'third', color: 'green' }
        ],
        ['id', 'variant'],
        (val) => ({ value: val.color }),
      );

      expect(result).toEqual({
        first: {
          default: { value: 'red' },
          lighter: { value: 'light-red' },
          darker: { value: 'dark-red' },
        },
        second: { value: 'blue' },
        third: { value: 'green' },
      });
    });

    it ('should use an incrementing index for missing keys', () => {
      const result = createTreeOfLeastDepth(
        [
          { id: 'first', color: 'red' },
          { id: 'first', variant: 'lighter', color: 'light-red' },
          { id: 'first', variant: 'darker', color: 'dark-red' },
          { id: 'second', color: 'blue' },
          { id: 'second', color: 'light-blue' },
          { id: 'second', color: 'dark-blue' },
          { id: 'third', color: 'green' }
        ],
        ['id', 'variant'],
        (val) => ({ value: val.color }),
      );

      expect(result).toEqual({
        first: {
          default: { value: 'red' },
          lighter: { value: 'light-red' },
          darker: { value: 'dark-red' },
        },
        second: {
          default: { value: 'blue' },
          variant1: { value: 'light-blue' },
          variant2: { value: 'dark-blue' },
        },
        third: { value: 'green' },
      });
    });

    it ('should correctly map a simple structure of three levels', () => {
      const result = createTreeOfLeastDepth(
        [
          { id: 'first', type: 'background', color: 'red' },
          { id: 'first', variant: 'lighter', type: 'background', color: 'light-red' },
          { id: 'first', variant: 'darker', type: 'background', color: 'dark-red' },
          { id: 'first', type: 'border', color: 'red' },
          { id: 'first', variant: 'lighter', type: 'border', color: 'light-red' },
          { id: 'first', variant: 'darker', type: 'border', color: 'dark-red' },
          { id: 'second', color: 'blue' },
          { id: 'third', color: 'green' }
        ],
        ['id', 'type', 'variant'],
        (val) => ({ value: val.color }),
      );

      expect(result).toEqual({
        first: {
          background: {
            default: { value: 'red' },
            lighter: { value: 'light-red' },
            darker: { value: 'dark-red' },
          },
          border: {
            default: { value: 'red' },
            lighter: { value: 'light-red' },
            darker: { value: 'dark-red' },
          }
        },
        second: { value: 'blue' },
        third: { value: 'green' },
      });
    });

    it ('should ignore deeper identifiers if only a single token is present', () => {
      const result = createTreeOfLeastDepth(
        [
          { id: 'first', variant: 'base', color: 'red' },
          { id: 'first', variant: 'lighter', color: 'light-red' },
          { id: 'first', variant: 'darker', color: 'dark-red' },
          { id: 'second', variant: 'base', type: 'border', color: 'blue' },
          { id: 'third', color: 'green' }
        ],
        ['id', 'variant', 'type'],
        (val) => ({ value: val.color }),
      );

      expect(result).toEqual({
        first: {
          base: { value: 'red' },
          lighter: { value: 'light-red' },
          darker: { value: 'dark-red' },
        },
        second: { value: 'blue' },
        third: { value: 'green' },
      });
    });

    it ('should transform dashed keys to camelCase', () => {
      const result = createTreeOfLeastDepth(
        [
          { id: 'simple', type: 'inner-shadow', spread: 0 },
          { id: 'simple', type: 'drop-shadow', spread: 1 },
          { id: 'large', type: 'darker', spread: 5 },
        ],
        ['id', 'type'],
        (val) => ({ value: `${val.spread}` }),
      );

      expect(result).toEqual({
        simple: {
          innerShadow: { value: '0' },
          dropShadow: { value: '1' },
        },
        large: { value: '5' },
      });
    });
  });
});
