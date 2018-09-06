const { convertNSColorToRGB } = require('../utils');

describe('[utils.js] test suite', () => {
  describe('-> #convertNSColorToRGB', () => {
    const NSColorChannel = 0.6235294117647059;

    it('should output a valid, fixed number', () => {
      expect(typeof convertNSColorToRGB(NSColorChannel)).toBe('number');
      expect(Number.isInteger(convertNSColorToRGB(NSColorChannel))).toBe(true);
    });
  });
});
