const FIXTURES = require('./__fixtures__/mapper.sketch');
const getMapper = require('..');
const formatColor = require('../sketch/color');
const { FILE_TYPES } = require('../../parser/constants');

const mappers = getMapper(FILE_TYPES.SKETCH);

describe('[mapper.js] test suite', () => {
  describe('-> #formatColor:', () => {
    it('given RGB NSColor, should transform it to a nicely parsed object', () => {
      const [ULTRAMARINE] = FIXTURES.DOCUMENT_COLORS;
      expect(formatColor(ULTRAMARINE)).toMatchSnapshot();
    });
  });

  describe('-> #mapColors:', () => {
    it('given the document colors, should transform all colors nicely', () => {
      expect(FIXTURES.DOCUMENT_COLORS.map(mappers.colors)).toMatchSnapshot();
    });

    it('given artboard colors, should transform all colors nicely', () => {
      expect(FIXTURES.ARTBOARD_COLORS.map(mappers.colors)).toMatchSnapshot();
    });
  });

  describe('-> #mapTextStyles:', () => {
    it('given the text styles, should transform them nicely', () => {
      const textStyles = FIXTURES.TEXT_STYLES.map((stl) => mappers.textStyles(stl, true));
      expect(textStyles).toMatchSnapshot();

      textStyles.forEach(style => {
        expect(Object.keys(style))
          .toEqual(expect.arrayContaining(['family', 'id', 'token', 'size', 'weight']));
      });

      const heading1 = textStyles.find(ts => ts.id === 'heading1');
      expect(heading1).toMatchObject({ lineHeight: 57.6 });

      const quote = textStyles.find(ts => ts.id === 'quote');
      expect(quote).toMatchObject({
        paragraphSpacing: 0,
        kerning: 0.6,
      });

      const heading2 = textStyles.find(ts => ts.id === 'heading2');
      expect(heading2.lineHeight).toBe(parseFloat((heading2.size * 1.2).toFixed(2)))
    });
  });

  describe('-> #mapGradients:', () => {
    it('given artboard gradients, should transform them nicely', () => {
      expect(FIXTURES.ARTBOARD_GRADIENTS.map(mappers.gradients)).toMatchSnapshot();
    });

    it('given docuement gradients, should transform them nicely', () => {
      expect(FIXTURES.DOCUMENT_GRADIENTS.map(mappers.gradients)).toMatchSnapshot();
    });
  });

  describe('-> #mapShadows:', () => {
    it('given artboard gradients, should transform them nicely', () => {
      const parsed = FIXTURES.ARTBOARD_SHADOWS.map(mappers.shadows);
      expect(parsed).toMatchSnapshot();
    });
  });

  describe('-> #mapBorders:', () => {
    it('given artboard borders, should transform them nicely', () => {
      const parsed = FIXTURES.ARTBOARD_BORDERS.map(mappers.borders);
      expect(parsed).toMatchSnapshot();
    });
  });
});
