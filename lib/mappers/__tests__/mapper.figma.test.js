const getFixtures = require('./__fixtures__/mapper.figma');
const getMapper = require('..');

let FIXTURES = {};
let mapper;

beforeAll(() => {
  mapper = getMapper('');
  FIXTURES = getFixtures();
})

describe('figma mapper test suite', () => {
  describe('-> #formatColors:', () => {
    it('Given figma formatted array of JSON colors, should transform to a nicely parsed array', () => {
        expect(mapper.mapColors(FIXTURES.COLORS)).toMatchSnapshot();
    })
  })
})
  
  describe('-> #formatTextStyles:', () => {
    it('Given figma formatted array of JSON textstyles, should transform to a nicely parsed array', () => {
      expect(mapper.mapTextStyles(FIXTURES.TEXT_STYLES)).toMatchSnapshot();
    })
  })

  describe('-> #formatGradients:', () => {
    it('Given figma formatted array of JSON gradients, shoudl transform to a nicely parsed array', () => {
      expect(mapper.mapGradients(FIXTURES.GRADIENTS)).toMatchSnapshot();
    })
  })

  describe('-> #formatShadows', () => {
    it('Given figma formatted array of JSON shadows, should transform to a nicely parsed array', () => {
      expect(mapper.mapShadows(FIXTURES.SHADOWS)).toMatchSnapshot();
    })
  })

  describe('-> #formatBorders:', () => {
    it('Given figma formatted array of JSON borders, should transform to a nicely parsed array', () => {
      expect(mapper.mapBorders(FIXTURES.BORDERS)).toMatchSnapshot();
    })
  })
