const FIXTURES = require('./__fixtures__/mapper.sketch');

const getMapper = require('..');
const formatColor = require('../sketch/color');

let mapper;
beforeAll(() => {
   mapper = getMapper("sketch");
})

describe('[mapper.js] test suite', () => {
  describe('-> #formatColor:', () => {
    it('given RGB NSColor, should transform it to a nicely parsed object', () => {
      const [ULTRAMARINE] = FIXTURES.DOCUMENT_COLORS;
      expect(formatColor(ULTRAMARINE)).toMatchSnapshot();
    });
  });

  describe('-> #mapColors:', () => {
    it('given the document colors, should transform all colors nicely', () => {
      expect(mapper.mapColors(FIXTURES.DOCUMENT_COLORS)).toMatchSnapshot();
    });

    it('given artboard colors, should transform all colors nicely', () => {
      expect(mapper.mapColors(FIXTURES.ARTBOARD_COLORS)).toMatchSnapshot();
    });
  });

  describe('-> #mapTextStyles:', () => {
    it('given the text styles, should transform them nicely', () => {
      const textStyles = mapper.mapTextStyles(FIXTURES.TEXT_STYLES);
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
      expect(mapper.mapGradients(FIXTURES.ARTBOARD_GRADIENTS)).toMatchSnapshot();
    });

    it('given docuement gradients, should transform them nicely', () => {
      expect(mapper.mapGradients(FIXTURES.DOCUMENT_GRADIENTS)).toMatchSnapshot();
    });
  });

  describe('-> #mapShadows:', () => {
    it('given artboard gradients, should transform them nicely', () => {
      const parsed = mapper.mapShadows(FIXTURES.ARTBOARD_SHADOWS);
      expect(parsed).toMatchSnapshot();
    });
  });

  describe('-> #mapBorders:', () => {
    it('given artboard borders, should transform them nicely', () => {
      const parsed = mapper.mapBorders(FIXTURES.ARTBOARD_BORDERS);
      expect(parsed).toMatchSnapshot();
    });
  });
});
