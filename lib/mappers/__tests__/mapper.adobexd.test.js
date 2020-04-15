const { FILE_TYPES } = require('../../parser/constants');
const getFixtures = require('./__fixtures__/mapper.adobexd');
const getMapper = require('..');

const FIXTURES = getFixtures;
const mappers = getMapper(FILE_TYPES.ADOBEXD);

describe('Adobe XD mapper test suite', () => {
  describe('-> #formatColors:', () => {
    it('Given Adobe XD formatted array of JSON colors, should transform to a nicely parsed array', () => {
      expect(FIXTURES.colors.map(mappers.colors)).toMatchSnapshot();
    });
  });

  describe('-> #formatTextStyles:', () => {
    it('Given figma formatted array of JSON textstyles, should transform to a nicely parsed array', () => {
      expect(FIXTURES.textStyles.map(mappers.textStyles)).toMatchSnapshot();
    });
  });

  describe('-> #formatGradients:', () => {
    it('Given figma formatted array of JSON gradients, should transform to a nicely parsed array', () => {
      expect(FIXTURES.gradients.map(mappers.gradients)).toMatchSnapshot();
    });
  });

  describe('-> #formatShadows', () => {
    it('Given figma formatted array of JSON shadows, should transform to a nicely parsed array', () => {
      expect(FIXTURES.shadows.map(mappers.shadows)).toMatchSnapshot();
    });
  });

  describe('-> #formatBorders:', () => {
    it('Given figma formatted array of JSON borders, should transform to a nicely parsed array', () => {
      expect(FIXTURES.borders.map(mappers.borders)).toMatchSnapshot();
    });
  });

  describe('-> #formatBlurs:', () => {
    it('Given figma formatted array of JSON blurs, should transform to a nicely parsed array', () => {
      expect(FIXTURES.borders.map(mappers.blurs)).toMatchSnapshot();
    });
  });
});