const { convertNSColorToRGB, uniqueArray, mapColorKeys, getCoordinatesFromStringPoint } = require('../utils');

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
    it('should output an object with full name keys', () => {
      const color = {
        r: 255,
        g: 20,
        b: 147,
        a: 0.6,
      };
      expect(mapColorKeys(color)).toEqual({red: color.r, green: color.g, blue: color.b, alpha: color.a});
    })
  });

  describe('-> #getCoordinatesFromStringPoint', () => {
    it('should map string coordinates to an tuple with those coordinates', () => {
      const coords = '{0.457757575, 0.3004040949}';
      expect(getCoordinatesFromStringPoint(coords)).toEqual([
        0.457757575,
        0.3004040949,
      ]);
    });

    it('should return an empty array for invalid string points', () => {
      expect(getCoordinatesFromStringPoint('')).toEqual([]);
    });

    it('should throw for non string values passed', () => {
      expect(() => getCoordinatesFromStringPoint([])).toThrowError(TypeError);
      expect(() => getCoordinatesFromStringPoint({})).toThrowError(TypeError);
      expect(() => getCoordinatesFromStringPoint(undefined)).toThrowError(TypeError);
    });
  });
});
