const { convertNSColorToRGB, uniqueArray, mapColorKeys } = require('../utils');

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

  describe('-> #mapColorKeys', () => {
    describe('should output an object with full name keys', () => {
      const color = {
        r: 255,
        g: 20,
        b: 147,
        a: 0.6,
      };
      expect(mapColorKeys(color)).toEqual({red: color.r, green: color.g, blue: color.b, alpha: color.a});
    })
  })
});
