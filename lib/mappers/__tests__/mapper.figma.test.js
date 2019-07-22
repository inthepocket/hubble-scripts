const { FILE_TYPES } = require('../../parser/constants');
const getFixtures = require('./__fixtures__/mapper.figma');
const getMapper = require('..');

const FIXTURES = getFixtures();
const mappers = getMapper(FILE_TYPES.FIGMA);

describe('figma mapper test suite', () => {

  describe('-> #formatColors:', () => {
    it('Given figma formatted array of JSON colors, should transform to a nicely parsed array', () => {
        expect(FIXTURES.COLORS.map(mappers.colors)).toMatchSnapshot();
    });
  });

  describe('-> #formatTextStyles:', () => {
    it('Given figma formatted array of JSON textstyles, should transform to a nicely parsed array', () => {
      expect(FIXTURES.TEXT_STYLES.map(mappers.textStyles)).toMatchSnapshot();
    });
  });

  describe('-> #formatGradients:', () => {
    it('Given figma formatted array of JSON gradients, should transform to a nicely parsed array', () => {
      expect(FIXTURES.GRADIENTS.map(mappers.gradients)).toMatchSnapshot();
    });
  });

  describe('-> #formatShadows', () => {
    it('Given figma formatted array of JSON shadows, should transform to a nicely parsed array', () => {
      expect(FIXTURES.SHADOWS.map(mappers.shadows)).toMatchSnapshot();
    });
  });

  describe('-> #formatBorders:', () => {
    it('Given figma formatted array of JSON borders, should transform to a nicely parsed array', () => {
      expect(FIXTURES.BORDERS.map(mappers.borders)).toMatchSnapshot();
    });
  });
});


