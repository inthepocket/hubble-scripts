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

# Usage

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
