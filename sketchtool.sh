#!/usr/bin/env bash

set -e

if [ $# -eq 0 ]; then
  echo "No arguments provided"
  echo "Please provide a sketchfile to export!"
  echo "e.g: npm run export MyFile.sketch"

  exit 1
fi

if [ -f /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool ]; then
  echo "Exporting slices as svg & png using sketchtool from file $1"
  /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool export slices "$1" --output=sketchtool-export/ --format=svg,png
else
  echo "💩  sketchtool was not found"
  echo "Please install Sketch.app and follow https://developer.sketchapp.com/guides/sketchtool/"

  exit 1
fi
