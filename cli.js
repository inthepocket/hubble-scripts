const meow = require('meow');

const app = require('./index');

const cli = meow(`
  Usage
    $ npm start <input> --outputDir="/home/usr/downloads"

  Options
    --outputDir=<dir>, -o     The directory where parsed files will be placed after a run
    --dump, -d                Dump all Sketch JSON files into 1 logdump.json
    --useColorArtboards       Use artboards named "primitives/color/<name>" to export colors instead of using the document colors
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
    }
  },
});

app(cli.input, cli.flags);
