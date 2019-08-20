const meow = require('meow');

const app = require('./index');

const cli = meow(
  `
  Usage
    $ hubble-cli <input> [options]

  Options
    --outputDir=<dir>, -o           The directory where parsed files will be placed after a run. Defaults to current working directory.
    --dump, -d                      Dump raw file output into logdump.json.
                                      For Sketch this is the JSON inside the .sketch file bundle,
                                      for Figma this is the received REST API response.
    --useColorArtboards             Use artboard formatting to export colors instead of using the document colors.
    --useGradientArtboards          Use artboard formatting to export gradients instead of using the document gradients.
    --useStyleDictionaryOutput, -s  Generate Style Dictionary compatible output instead of the generic design token format.
    --token, -t                     Authorization token when accessing the Figma API.
    --exportAssets, -e              Export assets from Figma.

  Examples
    $ hubble-cli "__mocks/sample_sketchfile.sketch"
    $ hubble-cli "__mocks/sample_sketchfile.sketch" -d --useColorArtboards --outputDir="config/"
    $ hubble-cli --token "29-206..." HbgJuBVOwIOcoZMVnpG01LqA
    $ hubble-cli --token "29-206..." HbgJuBVOwIOcoZMVnpG01LqA --useStyleDictionary
`,
  {
    flags: {
      token: {
        type: 'string',
        alias: 't',
      },
      outputDir: {
        default: __dirname,
        type: 'string',
        alias: 'o',
      },
      dump: {
        type: 'boolean',
        alias: 'd',
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
        alias: 's',
      },
      exportAssets: {
        type: 'boolean',
        default: false,
        alias: 'e',
      },
      version: {
        type: 'boolean',
        alias: 'v',
      },
    },
  },
);

app(cli.input, cli.flags);
