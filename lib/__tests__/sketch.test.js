const { getColorId, getColorsFromArtboard, getPageArrays } = require('../sketch');
const dump = require('../../__mocks__/sample_dump.json');

describe('[sketch.js] test suite', () => {
  describe('-> #getColorId', () => {
    const validColorArtboard = {
      path: 'primitives/color/primaryColor',
      pathMixedCasing: 'PrimiTives/colOr/primaryColor',
      expectedId: 'primaryColor',
    };
    const validColorArtboardWithVariant = {
      path: 'primitives/color/primaryColor200',
      expectedId: 'primaryColor200',
      expectedVariant: 200,
    }
    const invalidColorArtboard = {
      ...validColorArtboardWithVariant,
      path: 'primitives/colors/primaryColor200',
    };

    it('gets the color id from a valid color artboard, without a variant', () => {
      const res = getColorId(validColorArtboard.path);
      expect(res).not.toHaveProperty('variant');
      expect(res).toMatchObject({ id: validColorArtboard.expectedId });
    });

    it('also gets the id when casing is mixed', () => {
      const res = getColorId(validColorArtboard.pathMixedCasing);
      expect(res).not.toHaveProperty('variant');
      expect(res).toMatchObject({ id: validColorArtboard.expectedId });
    });

    it('gets the color id from a valid color artboard, with a variant', () => {
      const res = getColorId(validColorArtboardWithVariant.path);
      expect(res).toHaveProperty('variant');
      expect(res).toMatchObject({
        id: validColorArtboardWithVariant.expectedId,
        variant: validColorArtboardWithVariant.expectedVariant
      });
    });

    it('throws an error when the color artboard has an invalid artboard name', () => {
      expect(() => getColorId(invalidColorArtboard.path)).toThrow();
    });
  });

  describe('-> #getPageArrays', () => {
    it('should return an array of pages in the document', () => {
      const res = getPageArrays(dump);
      expect(res).toBeInstanceOf(Array);
      expect(Array.isArray(res)).toBe(true);
      expect(res[0]).toHaveProperty('layers');
      expect(res[0]).toHaveProperty('name');
      expect(res[0]).toHaveProperty('sketchId');
    });
  });

  describe('-> #getColorsFromArtboard', () => {
    it('should return an array of colors from color artboards', () => {
      const [primitivesPage] = getPageArrays(dump)
      const res = getColorsFromArtboard(primitivesPage.layers);
      expect(res).toBeInstanceOf(Array);
      expect(Array.isArray(res)).toBe(true);
    });
  });
});
