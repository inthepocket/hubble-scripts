const sketchDump = require('../__mocks__/sketch/sample_dump.json');
const figmaDump = require('../__mocks__/figma/sample_dump.json');

const genericSketchArtboards = require('../__mocks__/sketch/sample_output.artboard.json');
const genericSketchDocument = require('../__mocks__/sketch/sample_output.document.json');
const styleDictSketch = require('../__mocks__/sketch/sample_output.styledictionary.json');

const genericFigma = require('../__mocks__/figma/sample_output.json');
const styleDictFigma = require('../__mocks__/figma/sample_output.styledictionary.json');

/**
 * This is a very basic snapshot-diffing test to harness
 * ourselves against external dependency or Sketch API changes.
 */
describe('Verify that the mocks are unchanged', () => {
  describe('for Sketch', () => {
    it.skip('-> Raw dump', () => {
      expect(sketchDump).toMatchSnapshot();
    });
    it('-> Generic Tokens: Artboard Format', () => {
      expect(genericSketchArtboards).toMatchSnapshot();
    });
    it('-> Generic Tokens: Document Styles', () => {
      expect(genericSketchDocument).toMatchSnapshot();
    });
    it('-> Style Dictionary', () => {
      expect(styleDictSketch).toMatchSnapshot();
    });
  });

  describe('for Figma', () => {
    it.skip('-> Raw dump', () => {
      expect(figmaDump).toMatchSnapshot();
    });
    it('-> Generic Tokens', () => {
      expect(genericFigma).toMatchSnapshot();
    });
    it('-> Style Dictionary', () => {
      expect(styleDictFigma).toMatchSnapshot();
    });
  });
});
