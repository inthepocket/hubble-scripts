const { getColorId, getColorsFromArtboard, getPageArrays } = require('../sketch');
const dump = require('../../__mocks__/sample_dump.json');

describe('[sketch.js] test suite', () => {
  describe('-> #getColorId', () => {
    const validColorArtboard = {
      path: 'primitives/color/primaryColor',
      expectedId: 'primaryColor',
    };
    const invalidColorArtboard = {
      path: 'primitives/colors/primaryColor200',
      expectedId: 'primaryColor200'
    };

    it('gets the color id from a valid color artboard', () => {
      const res = getColorId(validColorArtboard.path);
      expect(res).toBe(validColorArtboard.expectedId);
      expect(typeof res).toBe('string');
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
      res.forEach(color => {
        expect(Object.keys(color))
          .toEqual(['id', '_class', 'alpha', 'blue', 'green', 'red'])
      })
    });
  });
});
