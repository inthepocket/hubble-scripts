![Hubble Scripts logo][logo]

[![LICENSE](https://badgen.net/badge/license/MIT/blue)][license]
![Platform](https://badgen.net/badge/platform/macOS?icon=apple)
[![Releases](https://badgen.net/github/releases/inthepocket/hubble-scripts)][releases]
![Last commit](https://badgen.net/github/last-commit/inthepocket/hubble-scripts)
[![Latest release](https://badgen.net/github/release/inthepocket/hubble-scripts/stable)][latest release]
[![CI Status](https://badgen.net/travis/inthepocket/hubble-scripts)][travis]

> Scripts repository to export design data like colors, fonts & text, and map them to design tokens.

Map design data from Sketch to universally parseable JSON design tokens to integrate in your applications. This repository is an attempt to further automate design systems & tooling at In The Pocket. Assets can also be exported as platform-friendly PNG & SVG formats. This scripts library is the backbone of the [Hubble ecosystem][hubble homepage]

# Contents

- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

# Prerequisites

- macOS with Sketch 41+ (latest Sketch recommended)
- A recent bash version (bash@4.4 recommended)

# Installing

The easiest way to install is to download [one of the releases][releases] and download the hubble-cli binary. This can be executed by most shells and will only output design tokens.

If you're looking to also export assets, download [`sketchtool.sh`][sketchtool], which is a shell script wrapper around Sketch's [sketchtool binary][sketchtool docs].

# Usage

> There is a sample sketchfile in the [__mocks__][mocks] folder with sample output that would be generated for this file.

hubble-scripts works best with a separate Sketch [library file][sketch library docs].

## Generating JSON config

You can use the `hubble-cli` binary to export design data out of your Sketch file and map it to a generic JSON design token format.

```shell
# This will generate a `hubble-data.json` file with text styles & colors found in a Sketch document:
$ ./hubble-cli "/Users/hubble/Desktop/MyDesign.sketch"

# You can optionally specify a config output dir. Otherwise current working directory will be used:
$ ./hubble-cli "/Users/hubble/Desktop/MyDesign.sketch" --outputDir="/var/hubble/"
```

If you need more fine-tuning over this export flow, Hubble provides even more options to [customise your design token output][wiki].

## Exporting assets

Assets can be exported using the `sketchtool.sh` script. This process exports all layers marked as exportable or that have been sliced.

```shell
# This will export assets as SVG (for web) and PNG (1x, 2x, 3x for native)
$ ./sketchtool.sh "/Users/hubble/Desktop/MyDesign.sketch"

# You can optionally specify an asset output dir. Otherwise current working directory will be used:
$ ./sketchtool.sh "/Users/hubble/Desktop/MyDesign.sketch" "/var/hubble/assets/images"
```

## Integrating in a project

Copy `hubble-cli` and `sketchtool.sh` to a scripts folder in your project. This example uses npm run-tasks to describe the export flow:

```json
{
  "scripts": {
    "hubble:data": "./scripts/hubble-cli ...",
    "hubble:assets": "./scripts/sketchtool.sh ...",
    "hubble": "npm run hubble:data && npm run hubble:assets"
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
    $ hubble-cli <input> --outputDir="/home/usr/downloads"

  Options
    --outputDir=<dir>, -o     The directory where parsed files will be placed after a run. Defaults to current working directory
    --dump, -d                Dump all Sketch JSON files into 1 logdump.json
    --useColorArtboards       Use artboard formatting to export colors instead of using the document colors
    --useGradientArtboards    Use artboard formatting to export gradients instead of using the document gradients

  Examples
    $ hubble-cli "__mocks/sample_sketchfile.sketch"
    $ hubble-cli "__mocks__/sample_sketchfile.sketch" -d --useColorArtboards --outputDir="config/"
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
[mocks]: https://github.com/inthepocket/hubble-scripts/blob/master/__mocks__/
[sketchtool]: https://github.com/inthepocket/hubble-scripts/blob/master/sketchtool.sh

[travis]: https://travis-ci.org/inthepocket/hubble-scripts
[sketch library docs]: https://sketchapp.com/docs/libraries/
[sketchtool docs]: https://developer.sketchapp.com/guides/sketchtool/
