![Hubble Scripts logo][logo]

[![LICENSE](https://badgen.net/badge/license/MIT/blue)][license]
![Platform](https://badgen.net/badge/platform/macOS?icon=apple)
[![Releases](https://badgen.net/github/releases/inthepocket/hubble-scripts)][releases]
![Last commit](https://badgen.net/github/last-commit/inthepocket/hubble-scripts)
[![Latest release](https://badgen.net/github/release/inthepocket/hubble-scripts/stable)][latest release]
[![CI Status](https://badgen.net/circleci/inthepocket/hubble-scripts)][circle ci]

> Scripts repository to export design data like colors, fonts & text, and map them to design tokens.

The backbone of the [Hubble ecosystem][hubble homepage], this scripts repository exports design data like colors, fonts & text, and maps them to JSON design tokens to integrate in your applications. This repository is an attempt to further automate design systems & tooling at In The Pocket. Assets can also be exported as platform-friendly PNG & SVG formats.

# Contents

- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

# Prerequisites

__For parsing Sketch__:

- A recent bash version (bash@4.4 recommended)
- macOS with Sketch 41+ (latest Sketch recommended)

__For parsing Figma__:

- A Figma [access token][figma access token]

# Installing

The easiest way to install is to download [one of the releases][releases] and download the hubble-cli binary. This can be executed by most shells and will only output design tokens.

## Sketch

If you're looking to also export assets for Sketch, download [`sketchtool.sh`][sketchtool], which is a shell script wrapper around Sketch's [sketchtool binary][sketchtool docs].

# Usage

> There is a sample .sketch file and Figma file ID in the [__mocks__][mocks] folder with sample output that would be generated for this file.

hubble-scripts works best with a separate Sketch/Figma [library file][sketch library docs]. Take a look at the examples and short bits below, or refer to our [more advanced documentation][wiki].

## Generating JSON config

You can use the `hubble-cli` binary to export design data out of your file and map it to a generic JSON design token format.

```shell
# This will generate a `hubble-data.json` file with text styles & colors found in a Sketch document:
$ ./hubble-cli "__mocks/sketch/sample_sketchfile.sketch"
$ ./hubble-cli --token "29-206..." HbgJuBVOwIOcoZMVnpG01LqA

# You can optionally specify a config output dir. Otherwise current working directory will be used:
$ ./hubble-cli "__mocks/sketch/sample_sketchfile.sketch" --outputDir="/var/hubble/"
$ ./hubble-cli "__mocks/sketch/sample_sketchfile.sketch" --outputDir="/var/hubble/"
```

If you need more fine-tuning over this export flow, Hubble provides even more options to [customize your design token output][hubble-cli options].

### Style Dictionary

hubble-scripts supports a variant on our default generic design tokens, which is compatible with the [Style Dictionary][style dictionary] build system.
By taking advantage of Style Dictionary's structure, we can slot in their existing transformers to output to various platforms or languages.

For more information on our Style Dictionary output, check [the wiki][wiki style dictionary].

## Exporting assets

### Sketch

Assets can be exported using the `sketchtool.sh` script. This process exports all layers marked as exportable or that have been sliced.

```shell
# This will export normalized (lowercase, underscore) assets as SVG (for web) and PNG (1x, 2x, 3x for native)
$ ./sketchtool.sh "__mocks/sketch/sample_sketchfile.sketch"

# You can optionally specify an asset output dir. Otherwise current working directory will be used:
$ ./sketchtool.sh "__mocks/sketch/sample_sketchfile.sketch" "/var/hubble/assets/images"
```

### Figma

TODO:

## Integrating in a project

Copy `hubble-cli` and `sketchtool.sh` to a scripts folder in your project. This example uses npm run-tasks to describe the export flow:

```json
{
  "scripts": {
    "hubble:tokens": "./scripts/hubble-cli ...",
    "hubble:assets": "./scripts/sketchtool.sh ...",
    "hubble": "npm run hubble:tokens && npm run hubble:assets"
  }
}
```

# Contributing

❤ We appreciate every form of contribution, but before you contribute please make sure you have read the [contribution guidelines][contributing]

## Development

`hubble-cli` is a compiled binary of `cli.js`, a Node.js CLI wrapper around our `index.js` script. If you have Node you can run this script directly:

```shell
$ node cli.js --help

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

  Examples
    $ hubble-cli "__mocks/sample_sketchfile.sketch"
    $ hubble-cli "__mocks/sample_sketchfile.sketch" -d --useColorArtboards --outputDir="config/"
    $ hubble-cli --token "29-206..." HbgJuBVOwIOcoZMVnpG01LqA
    $ hubble-cli --token "29-206..." HbgJuBVOwIOcoZMVnpG01LqA --useStyleDictionary
```

For more on running in development mode, check the [wiki].

# License

[MIT][license]

<!-- LINKS -->
[hubble homepage]: https://hubble-design-system.netlify.com

[logo]: https://github.com/inthepocket/hubble-scripts/blob/master/.github/hubble-scripts-banner.png
[license]: https://github.com/inthepocket/hubble-scripts/blob/master/LICENSE
[contributing]: https://github.com/inthepocket/hubble-scripts/blob/master/CONTRIBUTING.md
[releases]: https://github.com/inthepocket/hubble-scripts/releases
[latest release]: https://github.com/inthepocket/hubble-scripts/releases/latest
[wiki]: https://github.com/inthepocket/hubble-scripts/wiki
[hubble-cli options]: https://github.com/inthepocket/hubble-scripts/wiki/Hubble-cli-options
[mocks]: https://github.com/inthepocket/hubble-scripts/blob/master/__mocks__/
[sketchtool]: https://github.com/inthepocket/hubble-scripts/blob/master/sketchtool.sh
[wiki style dictionary]: https://github.com/inthepocket/hubble-scripts/wiki/Exporting-design-tokens#style-dictionary

[travis]: https://travis-ci.org/inthepocket/hubble-scripts
[sketch library docs]: https://sketchapp.com/docs/libraries/
[sketchtool docs]: https://developer.sketchapp.com/guides/sketchtool/
[style dictionary]: https://amzn.github.io/style-dictionary
[figma access token]: https://www.figma.com/developers/api#access-tokens
