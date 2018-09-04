const { mapColors, mapTextStyles, formatColor } = require('../mappers');
const sampleOutput = require('../../__mocks__/sample_dump.json');

const [ULTRAMARINE, ...COLORS] = sampleOutput.document.assets.colors;
const TEXT_STYLES = sampleOutput.document.layerTextStyles;

describe('[mapper.js] test suite', () => {
  describe('-> #formatColor:', () => {
    it('given RGB NSColor, should transform it to a nicely parsed object', () => {
      expect(formatColor(ULTRAMARINE)).toMatchSnapshot();
    });
  });
  describe('-> #mapColors:', () => {
    it('given the document colors, should transform all colors nicely', () => {
      expect(mapColors(COLORS)).toMatchSnapshot();
    });
  });
  describe('-> #mapTextStyles:', () => {
    it('given the text styles, should transform them nicely', () => {
      const parsed = mapTextStyles(TEXT_STYLES);
      expect(parsed).toMatchSnapshot();

      const [heading1, heading2, paragraph] = parsed;
      expect(heading1.id).toBe('Heading 1');
      expect(heading2.id).toBe('Heading 2');
      expect(paragraph.id).toBe('Paragraph');
    });
  });
});
