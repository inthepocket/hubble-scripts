#!/usr/bin/env bash
set -e

# Pretty log output
function log() {
  printf "\\n\\033[1m\\033[34m%s\\033[0m\\n\\n" "[hubble-scripts] ${1}"
}

# @param $1 asset output dir
# @param $2 config output dir
# @param $3 bucket name
function upload_to_gcloud() {
  if ! command -v gsutil > /dev/null; then
    log "The required gsutil CLI was not found."
  fi

  if [ -z "$1" ]; then
    log "-> Google Cloud upload error: Parameter 1 was not supplied."
    log "You should supply the asset output dir as parameter 1"
    exit 1
  fi
  if [ -z "$2" ]; then
    log "-> Google Cloud upload error: Parameter 2 was not supplied."
    log "You should supply the config output dir as parameter 2"
    exit 1
  fi
  if [ -z "$3" ]; then
    log "-> Google Cloud upload error: Parameter 3 was not supplied."
    log "You should supply the Google Cloud bucket name as parameter 3 without the gs:// prefix"
    exit 1
  fi

  log "⛅️  Uploading to Google Cloud (using bucket: gs://$3)"

  # Upload asset output dir recursively to the provided bucket (in parallell)
  gsutil -m cp -r "$1" "gs://$3" && \
    # Upload config output to the provided bucket.
    gsutil cp "$2/hubble-data.json" "gs://$3"
}
