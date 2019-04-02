const sketchDump = require('../__mocks__/sample_dump.json');
const hubbleOutput = require('../__mocks__/sample_output.json');
const hubbleOutputAsDocument = require('../__mocks__/sample_output.document.json');
const hubbleOutputAsStyleDictionary = require('../__mocks__/sample_output.styledictionary.json');

/**
 * This is a very basic snapshot-diffing test to harness
 * ourselves against external dependency or Sketch API changes.
 */
describe('Verify that the mocks are unchanged', () => {
  it('for the Sketch dump', () => {
    expect(sketchDump).toMatchSnapshot();
  });
  it('for the hubble output (using artboards)', () => {
    expect(hubbleOutput).toMatchSnapshot();
  });
  it('for the hubble output (using document styles)', () => {
    expect(hubbleOutputAsDocument).toMatchSnapshot();
  });
  it('for the hubble output (using Style Dictionary)', () => {
    expect(hubbleOutputAsStyleDictionary).toMatchSnapshot();
  });
});
