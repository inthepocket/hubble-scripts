const meow = require('meow');

const app = require('./index');

const cli = meow(`
  Usage
  $ npm start <input> --outputDir="/home/usr/downloads"

  Options
  --outputDir, The directory where parsed files will be placed after a run
  --dump, Dump all Sketch JSON files into 1 logdump.json
`, {
  flags: {
    outputDir: {
      default: __dirname,
      type: 'string',
    },
    dump: {
      type: 'boolean',
    },
  },
});

app(cli.input, cli.flags);
