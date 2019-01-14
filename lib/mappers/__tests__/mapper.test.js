const FIXTURES = require('./__fixtures__/mapper');

const mapper = require('..');
const formatColor = require('../color');

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
      const parsed = mapper.mapTextStyles(FIXTURES.TEXT_STYLES);
      expect(parsed).toMatchSnapshot();

      const [heading1, heading2, paragraph] = parsed;
      expect(heading1.id).toBe('Heading 1');
      expect(heading2.id).toBe('Heading 2');
      expect(paragraph.id).toBe('Paragraph');
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
});
