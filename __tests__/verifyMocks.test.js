const sketchDump = require('../__mocks__/sample_dump.json');
const hubbleOutput = require('../__mocks__/sample_output.json');
const hubbleOutputAsDocument = require('../__mocks__/sample_output.json');
const hubbleOutputAsStyleDictionary = require('../__mocks__/sample_output.json');

/**
 * This is a very basic snapshot-diffing test to harness
 * ourselves against external dependency or Sketch API changes.
 */
describe('Verify if the mocks are unchanged', () => {
  it('should match previous output + dump after generating mocks', () => {
    expect(sketchDump).toMatchSnapshot();
    expect(hubbleOutput).toMatchSnapshot();
    expect(hubbleOutputAsDocument).toMatchSnapshot();
    expect(hubbleOutputAsStyleDictionary).toMatchSnapshot();
  });
});
