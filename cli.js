const meow = require('meow');

const app = require('./index');

const cli = meow(`
  Usage
  $ npm start <input>

  Options
  --dump, Dump all Sketch JSON files into 1 logdump.json
`, {
  flags: {
    dump: {
      type: 'boolean',
    },
  },
});

app(cli.input, cli.flags);
