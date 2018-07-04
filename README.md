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

## Importing into a project
Copy the file `sketchxport.sh` into your project and run it from project root.
Advised is to add a npm run task for this:

```json
{
  "scripts": {
    "sketchxport": "./scripts/sketchxport.sh"
  }
}
```

As these always run relative to project root, path resolving is not an issue.
