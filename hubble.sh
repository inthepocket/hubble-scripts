#!/usr/bin/env bash
set -e

# Pretty log output
function log() {
  printf "\\n\\033[1m\\033[34m%s\\033[0m\\n\\n" "[hubble-scripts] ${1}"
}

# Generate config file from hubble
function generate_config() {
  log "💎  Generating config from sketchfile..."
  node cli.js "$SKETCHFILE" --outputDir="$CONFIG_OUTPUT_DIR" "$@"
}

# Generate assets from hubble
function generate_assets() {
  log "💎  Exporting & moving assets from sketchfile..."

  if [ ! -d "$ASSETS_OUTPUT_DIR" ]; then
    log "Asset output dir does not exist yet. Creating it"
    mkdir -p "$ASSETS_OUTPUT_DIR"
  fi

  bash ./sketchtool.sh "$SKETCHFILE" "$ASSETS_OUTPUT_DIR"
}

function upload_to_cloud() {
  # You can enable custom cloud providers here to upload generated output to that provider
  # upload_to_gcloud "$ASSETS_OUTPUT_DIR" "$CONFIG_OUTPUT_DIR" "$1"
  exit 0
}

function main() {
  # Check if we got a sketchfile, otherwise exit 1
  if [ -z "$1" ]; then
    echo "No sketchfile provided"
    echo "Please provide a sketchfile to export!"
    echo "e.g: ./hubble.sh \"/home/usr/file.sketch\""
    exit 1
  fi

  SKETCHFILE=$1
  if [ -z "$2" ]; then CONFIG_OUTPUT_DIR="$PWD"; else CONFIG_OUTPUT_DIR=$2; fi
  if [ -z "$3" ]; then ASSETS_OUTPUT_DIR="$PWD/assets/images"; else ASSETS_OUTPUT_DIR=$3; fi

  # Source cloud providers
  for file in ./services/upload/*; do
    # shellcheck disable=SC1090,SC1091
    [ -r "$file" ] && [ -f "$file" ] && source "$file"
  done

  log "Sketchfile is $SKETCHFILE"
  log "Config output dir is $CONFIG_OUTPUT_DIR"
  log "Asset output dir is $ASSETS_OUTPUT_DIR"

  generate_config "$@"
  generate_assets "$@"

  upload_to_cloud "hubble-output-dir"
}
main "$@"
