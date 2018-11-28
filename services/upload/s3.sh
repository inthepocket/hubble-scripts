#!/usr/bin/env bash
set -e

# Pretty log output
function log() {
  printf "\\n\\033[1m\\033[34m%s\\033[0m\\n\\n" "[hubble-scripts] ${1}"
}

# @param $1 asset output dir
# @param $2 config output dir
# @param $3 bucket name
function upload_to_s3() {
  if ! command -v aws > /dev/null; then
    log "The required AWS CLI was not found."
  fi

  if [ -z "$1" ]; then
    log "-> AWS S3 upload error: Parameter 1 was not supplied."
    log "You should supply the asset output dir as parameter 1"
    exit 1
  fi
  if [ -z "$2" ]; then
    log "-> AWS S3 upload error: Parameter 2 was not supplied."
    log "You should supply the config output dir as parameter 2"
    exit 1
  fi
  if [ -z "$3" ]; then
    log "-> AWS S3 upload error: Parameter 3 was not supplied."
    log "You should supply the S3 bucket name as parameter 3 without the s3:// prefix"
    exit 1
  fi

  log "⛅️  Uploading to AWS S3 (using bucket: s3://$3)"

  # Upload asset output dir recursively to the provided bucket (in parallell)
  aws s3 cp "$1" "s3://$3" --recursive && \
    # Upload config output to the provided bucket.
    aws s3 cp "$2/hubble-data.json" "s3://$3"
}
