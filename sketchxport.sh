#!/usr/bin/env bash

# Set safe exit, $SKETCHXPORT_UNSAFE is a debug hook & CI hook to skip certain user checks
set -e

# Remember project root path to avoid sloppy cd globbing
MAIN_REPO_DIR=$(pwd)

# Pretty log output
function log() {
  printf "\\n\\033[1m\\033[34m%s\\033[0m\\n\\n" "${1}"
}

# Checkout inthepocket/sketchxport
function checkout() {
  if [ ! -d "$SKETCHXPORT_CLONE_DIR" ]; then
    log "🐙  Cloning and installing inthepocket/sketchxport..."
    git clone git@bitbucket.org:inthepocket/sketchxport.git "$SKETCHXPORT_CLONE_DIR" -q && cd "$SKETCHXPORT_CLONE_DIR"
    npm install --quiet
    cd "$MAIN_REPO_DIR" || exit
  else
    if [ "$SKETCHXPORT_UNSAFE" == true ]; then return; fi

    log "🐙  Grabbing latest changes for inthepocket/sketchxport..."
    cd "$SKETCHXPORT_CLONE_DIR"
    git pull -q
    cd "$MAIN_REPO_DIR" || exit
  fi
}

# Bring repository up to date with latest develop
function track_main_repo() {
  git checkout develop
  git reset origin/develop
  git pull
}

# Check if repository is up to date
function check_main_repo() {
  if [ "$SKETCHXPORT_UNSAFE" == true ]; then return; fi

  local currGitBranch
  currGitBranch=$(git rev-parse --abbrev-ref HEAD)

  log "🐙  Fetching repository changes..."
  git fetch

  if [ "$currGitBranch" != 'develop' ]; then
    echo "Current branch is not develop, sketchxport needs to run from develop"
    while true; do
      echo "Do you want to checkout & pull latest develop now? (y/n)"
      read -r -p "This may undo some of your current changes. " yn
      case $yn in
        [Yy]* ) track_main_repo; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer y or n.";;
      esac
    done
  fi

  if git status -uno | grep -q "branch is behind"; then
    log "🐙  Pulling latest changes for branch develop"
    git pull
  fi

  unset currGitBranch
  unset isLatestDevelop
}

# Create a new branch to commit on
function create_branch() {
  # TODO: this should ask for a Jira ticket (or optionally skip it)
  log "🌳  Creating a new git branch for sketchxport update..."
  git checkout -b "$REPO_BRANCH"
}

# Commit new assets & config, signed off by git user
function commit_changes() {
  log "➕  Adding new changes as signed-off commit"
  git add .
  git commit -s -m "[Sketchxport $(date +%d-%m-%Y)]: $SKETCHXPORT_COMMIT_MSG"
}

# Generate config file from sketchxport
function generate_config() {
  log "💎  Generating config from sketchfile..."
  cd "$SKETCHXPORT_CLONE_DIR"
  npm start "$SKETCHFILE"
  mv config.json "$MAIN_REPO_DIR"
  cd "$MAIN_REPO_DIR" || exit
}

# Generate assets from sketchxport
function generate_assets() {
  log "💎  Exporting & moving assets from sketchfile..."
  cd "$SKETCHXPORT_CLONE_DIR"
  npm run export "$SKETCHFILE"
  mkdir -p "$MAIN_REPO_DIR/$SKETCHXPORT_OUTPUT_DIR"
  mv sketchtool-export/* "$MAIN_REPO_DIR/$SKETCHXPORT_OUTPUT_DIR"
  cd "$MAIN_REPO_DIR" || exit
}

function main() {
  # Check if arg 1 is supplied, otherwise exit
  if [ -z "$1" ]; then
    echo "No sketchfile provided"
    echo "Please provide a sketchfile to export!"
    echo "e.g: npm run sketchxport \"/Users/thibault.maekelbergh/Downloads/Daikin_MVP7.sketch\""
    exit 1
  fi

  SKETCHFILE=$1
  source sketchxport.conf

  checkout
  check_main_repo
  generate_config "$@"
  generate_assets "$@"
  create_branch
  commit_changes

  echo "Changes have been updated in the repo succesfully!"
  echo "Head over to https://bitbucket.org/$REPO_URL/branches/compare/$REPO_BRANCH%0Ddevelop and click the \"Create Pull Request\" button"
}
main "$@"
