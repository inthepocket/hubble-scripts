<div align="center">
  <h1 align="center">🔭 hubble-scripts</h1>
  <div align="center">
    <img src="./icon.png" alt="Hubble Icon" />
    <p>
      <a href='./LICENSE'>
        <img src="https://badgen.net/badge/license/MIT/blue" alt="MIT License">
      </a>
      <img src="https://badgen.net/badge/platform/macOS?icon=apple" alt="" />
      <a href="https://github.com/inthepocket/hubble-scripts/releases">
        <img src="https://badgen.net/github/releases/inthepocket/hubble-scripts" />
      </a>
      <img src="https://badgen.net/github/last-commit/inthepocket/hubble-scripts" />
      <a href="https://travis-ci.org/inthepocket/hubble-scripts">
        <img src="https://badgen.net/travis/inthepocket/hubble-scripts" />
      </a>
    </p>
    <p>
      Export configuration data like colors, fonts & text styles out of sketch to a universally parseable JSON format.<br/>
      This repository is an attempt to further automate design systems & tooling at In The Pocket.<br/>
      <br/>
      Assets can also be exported as platform-friendly PNG & SVG formats.
    </p>
  </div>
</div>

# Prerequisites

- macOS with Sketch 41+
- A recent bash version (bash@4.4 recommended)
- A recent node version (node@8 recommended)

# Usage

> There is a sample sketchfile in the [__mocks__](./__mocks__) folder with sample output that would be generated for this file.

## Generating JSON config

This will generate a `hubble-data.json` file with text styles & colors found in a Sketch document.
Works best with a library file.

```bash
bash ./hubble.sh "/home/usr/file.sketch"
```

You can optionally specify a config output dir as $2 and asset output dir as $3. Otherwise current working directory will be used:

```bash
bash ./hubble.sh "/home/usr/file.sketch" "/var/hubble" "/var/hubble/assets/images"
```

## Exporting assets

Will export all assets as SVG (for web) and PNG (1x, 2x, 3x for native).
Works best with a library file.

```bash
bash ./sketchtool.sh "MyFile.sketch" "/var/hubble/assets/images"
```

## Uploading to cloud

There are scripts to upload your files to AWS S3 and to Google Cloud.
It is assumed that you have [aws-cli](https://aws.amazon.com/cli/) or [gsutil](https://cloud.google.com/storage/docs/gsutil) cli already installed and configured.

Each script takes 3 arguments
1) Assets output folder
2) Configuration output folder
3) Bucket name

You can configure this service by adding one of these lines to `sketchxport.sh`

`upload_to_gcloud "$ASSETS_OUTPUT_DIR" "$CONFIG_OUTPUT_DIR" "$1"`

`upload_to_s3 "$ASSETS_OUTPUT_DIR" "$CONFIG_OUTPUT_DIR" "$1"`

# Integrations

## Importing into a project

Copy `hubble.sh` and `sketchtool.sh` to a scripts folder in your project
Advised is to add a npm run task for this:

```json
{
  "scripts": {
    "hubble": "./scripts/hubble.sh"
  }
}
```

# Testing

This project uses [jest](https://jestjs.io/) to run tests. You can trigger the tests with `npm test`.

## Mocks & sample output

All tests will be validated against the sample output in [__mocks__](./__mocks__). You can regenerate these using `npm run generate:mocks` which will consume `__mocks__/sample_sketchfile.sketch` and output a new config & sketch2json dump.

## Local CI server mocking

If you have Docker installed you could use [trevor](https://github.com/vadimdemedes/trevor) to locally mock our Travis CI server before submitting a pull request or while testing a new change. It will pull a node@8:alpine image from Docker Hub and run tests inside of the container, and afterwards destroy the container.

## Bash

[Shellcheck](https://github.com/koalaman/shellcheck) is used to ensure consistent and safe shell (bash) scripts. Make sure you have shellcheck installed and run the lint command to test the scripts:

```console
$ brew install shellcheck
$ npm run lint:shell

In hubble.sh line 6:
  printf "\n\\033[1m\\033[34m%s\\033[0m\\n\\n" "[hubble-scripts] ${1}"
          ^-- SC1117: Backslash is literal in "\n". Prefer explicit escaping: "\\n".

```
