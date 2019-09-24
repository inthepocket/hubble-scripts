const meow = require('meow');

const app = require('./index');

const cli = meow(
  `
  Usage
    $ hubble-cli <input> [options]

  Options
    --outputDir=<dir>, -o           The directory where parsed files will be placed after a run. Defaults to current working directory.
    --useStyleDictionaryOutput, -s  Generate Style Dictionary compatible output instead of the generic design token format.

  Options: Sketch
    --dump, -d                      Dump the JSON output from the .sketch file.
    --useColorArtboards             Use artboard formatting to export colors instead of using the document colors.
    --useGradientArtboards          Use artboard formatting to export gradients instead of using the document gradients.
    --ignoreTextStylePaths          Textstyles that use slashes to enable navigation in Sketch will be ignored
                                    and their id will be the first part of the path.

  Options: Figma
    --dump, -d                      Dump the received JSON response from the Figma REST API.
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
      ignoreTextStylePaths: {
        type: 'boolean',
        default: false,
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
