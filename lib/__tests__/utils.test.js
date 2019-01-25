const { convertNSColorToRGB, uniqueArray } = require('../utils');

describe('[utils.js] test suite', () => {
  describe('-> #convertNSColorToRGB', () => {
    const NSColorChannel = 0.6235294117647059;

    it('should output a valid, fixed number', () => {
      expect(typeof convertNSColorToRGB(NSColorChannel)).toBe('number');
      expect(Number.isInteger(convertNSColorToRGB(NSColorChannel))).toBe(true);
    });
  });

  describe(`-> unique`, () => {
    it(`should return an array without duplicate values`, () => {
      const arrayWithDupes = [1, 2, 1, `a`, `b`, String(`a`)];
      expect(uniqueArray(arrayWithDupes)).toEqual([1, 2, `a`, `b`]);
    });
  });
});
