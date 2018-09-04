<p align="center">
  <h1 align="center">💎 sketchxport-scripts</h1>

  <p align="center">
    <a href='./LICENSE'>
      <img src="https://badgen.net/badge/license/MIT/blue" alt="MIT License">
    </a>
    <img src="https://badgen.net/badge/platform/macOS?icon=apple" alt="" />
  </p>

  <p align="center">
    Export configuration data like colors, fonts & text styles out of sketch to a universally parseable JSON format.<br/>
    This repository is an attempt to further automate design systems & tooling at In The Pocket.<br/>
    <br/>
    Assets can also be exported as platform-friendly PNG & SVG formats.
  </p>
</p>

# Prerequisites

- macOS with Sketch 41+
- A recent bash version (bash@4.4 recommended)
- A recent node version (node@8 recommended)

# Usage

> There is a sample sketchfile in the [__mocks__](./__mocks__) folder with sample output that would be generated for this file.

## Generating JSON config

This will generate a `config.json` file with text styles & colors found in a Sketch document.
Works best with a library file.

```bash
bash ./sketchxport.sh "/home/usr/file.sketch"
```

You can optionally specify a config output dir as $2 and asset output dir as $3. Otherwise current working directory will be used:

```bash
bash ./sketchxport.sh "/home/usr/file.sketch" "/var/sketchxport" "/var/sketchxport/assets/images"
```

## Exporting assets

Will export all assets as SVG (for web) and PNG (1x, 2x, 3x for native).
Works best with a library file.

```bash
bash ./sketchtool.sh "MyFile.sketch" "/var/sketchxport/assets/images"
```

# Integrations

## Importing into a project

Copy `sketchxport.sh` and `sketchtool.sh` to a scripts folder in your project
Advised is to add a npm run task for this:

```json
{
  "scripts": {
    "sketchxport": "./scripts/sketchxport.sh"
  }
}
```

# Testing

This project uses [jest](https://jestjs.io/) to run tests. You can trigger the tests with `npm test`.

## Mocks & sample output

All tests will be validated against the sample output in [__mocks__](./__mocks__). You can regenerate these using `npm run generate:mocks` which will consume `__mocks__/sample_sketchfile.sketch` and output a new config & sketch2json dump.

## Local CI server mocking

If you have Docker installed you could use [trevor](https://github.com/vadimdemedes/trevor) to locally mock our Travis CI server before submitting a pull request or while testing a new change. It will pull a node@8:alpine image from Docker Hub and run tests inside of the container, and afterwards destroy the container.
