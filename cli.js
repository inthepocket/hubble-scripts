const meow = require('meow');

const app = require('./index');

const cli = meow(`
  Usage
    $ hubble-cli <input> --outputDir="/home/usr/downloads"

  Options
    --outputDir=<dir>, -o           The directory where parsed files will be placed after a run. Defaults to current working directory
    --dump, -d                      Dump all Sketch JSON files into 1 logdump.json
    --useColorArtboards             Use artboard formatting to export colors instead of using the document colors
    --useGradientArtboards          Use artboard formatting to export gradients instead of using the document gradients
    --useStyleDictionaryOutput, -s  Generate Style Dictionary compatible output in addition to the regular itp tokens.

  Examples
    $ hubble-cli "__mocks/sample_sketchfile.sketch"
    $ hubble-cli "__mocks__/sample_sketchfile.sketch" -d --useColorArtboards --outputDir="config/"
`, {
  flags: {
    outputDir: {
      default: __dirname,
      type: 'string',
      alias: 'o'
    },
    dump: {
      type: 'boolean',
      alias: 'd'
    },
    useColorArtboards: {
      type: 'boolean',
      default: false,
    },
    useGradientArtboards: {
      type: 'boolean',
      default: false,
    },
    useStyleDictionaryOutput: {
      type: 'boolean',
      default: false,
      alias: 's'
    },
    version: {
      type: "boolean",
      alias: 'v',
    }
  },
});

app(cli.input, cli.flags);
