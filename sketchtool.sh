#!/usr/bin/env bash

set -e

function check_file_input() {
  if [ $# -eq 0 ]; then
    echo "No arguments provided"
    echo "Please provide a sketchfile to export!"
    echo "e.g: npm run export MyFile.sketch"

    exit 1
  fi
}

function export_assets() {
  if [ -f /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool ]; then
    echo "Exporting slices as svg & png(1x,2x,3x) to directory $2"

    /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool export slices "$1" --output="$2" \
      --format="png" --scales="1, 2, 3"

    /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool export slices "$1" --output="$2" \
      --format="svg"
  else
    echo "💩  sketchtool was not found"
    echo "Please install Sketch.app and follow https://developer.sketchapp.com/guides/sketchtool/"
    exit 1
  fi
}

function main() {
  check_file_input "$@"
  export_assets "$@"
}
main "$@"
