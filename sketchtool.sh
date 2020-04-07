#!/usr/bin/env bash
set -e

# Pretty log output
function log() {
  printf "\\n\\033[1m\\033[34m%s\\033[0m\\n\\n" "[hubble-scripts] ${1}"
}

SKETCHTOOL_BINARY="$(mdfind kMDItemCFBundleIdentifier == 'com.bohemiancoding.sketch3' | head -n 1)/Contents/Resources/sketchtool/bin/sketchtool"

function check_file_input() {
  if [ $# -eq 0 ]; then
    echo "No arguments provided"
    echo "Please provide a sketchfile to export and an output dir!"
    echo "e.g: /sketchtool.sh MyFile.sketch /var/hubble/assets/images"
    exit 1
  fi

  if [ -z "$2" ]; then
    OUTPUT_DIR="$PWD/assets/images"
  else
    OUTPUT_DIR=$2
  fi
}

function export_assets() {
  log "Exporting slices as SVG, PNG@(1x,1.5x,2x,3x,4x), PDF to directory $2"
  "$SKETCHTOOL_BINARY" export slices "$1" --output="$OUTPUT_DIR" --format="png" --scales="1, 1.5, 2, 3, 4"
  "$SKETCHTOOL_BINARY" export slices "$1" --output="$OUTPUT_DIR" --format="svg"
  "$SKETCHTOOL_BINARY" export slices "$1" --output="$OUTPUT_DIR" --format="pdf"
}

# Transform asset:
#   -> filenames to all lowercase
#   -> replace spaces with underscores
#   -> strip SVG comments
#   -> sketchtool incorrectly maps 1.5x to 1x, replace that as well.
function transform_assets() {
  find "$OUTPUT_DIR" -name '*.png' | while read -r line; do
    mv "$line" "$(echo "$line" | tr "[:upper:]" "[:lower:]" | tr ' ' '_' | sed s/@1x/@1.5x/)"
  done

  find "$OUTPUT_DIR" -name '*.svg' | while read -r line; do
    sed -i '' -e '/<!--.*-->/d' "$line"
    mv "$line" "$(echo "$line" | tr "[:upper:]" "[:lower:]" | tr ' ' '_')"
  done
}

function main() {
  if [ "$(uname)" != "Darwin" ]; then
    echo "This wrapper around sketchtool is only supported on macOS"
    exit 1
  fi

  if [ -f SKETCHTOOL_BINARY ]; then
    log "sketchtool was not found"
    log "Please install Sketch and follow https://developer.sketch.com/cli/"
    exit 1
  fi

  check_file_input "$@"
  export_assets "$@" && transform_assets
}
main "$@"
