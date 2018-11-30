#!/usr/bin/env bash
set -e

# Pretty log output
function log() {
  printf "\\n\\033[1m\\033[34m%s\\033[0m\\n\\n" "[hubble-scripts] ${1}"
}

function check_file_input() {
  if [ $# -eq 0 ]; then
    echo "No arguments provided"
    echo "Please provide a sketchfile to export and an output dir!"
    echo "e.g: bash ./sketchtool.sh MyFile.sketch /var/hubble/assets/images"

    exit 1
  fi

  if [ -z "$2" ]; then OUTPUT_DIR="$PWD/assets/images"; else OUTPUT_DIR=$2; fi
}

function export_assets() {
  if [ ! -d /Applications/Sketch.app ]; then
    log "Doesn't seem like you have Sketch installed..."
    log "Please make sure Sketch is installed and at the path /Applications/Sketch.app"
  fi

  if [ -f /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool ]; then
    log "Exporting slices as svg & png(1x,2x,3x) to directory $2"

    /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool export slices "$1" --output="$OUTPUT_DIR" \
      --format="png" --scales="1, 2, 3"

    /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool export slices "$1" --output="$OUTPUT_DIR" \
      --format="svg"
  else
    log "💩  sketchtool was not found"
    log "Please install Sketch.app and follow https://developer.sketchapp.com/guides/sketchtool/"
    exit 1
  fi
}

function main() {
  check_file_input "$@"
  export_assets "$@"
}
main "$@"
