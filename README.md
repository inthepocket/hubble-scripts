# Sketchxport

## Generating config

This will generate a `config.json` file with text styles & colors found in a Sketch document.
Works best with a library file.

```console
npm start "/Volumes/GoogleDrive/design/MyLibraryFile.sketch"
```

## Exporting assets

Will export all assets as SVG (for web) and PNG (1x, 2x, 3x for native) to a `sketchtool-export` folder.
Works best with a library file.

```console
npm run export "/Volumes/GoogleDrive/design/MyLibraryFile.sketch"
```
