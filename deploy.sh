#!/bin/bash

# deploy.sh
# Use this script to start up. This will check to see if there are any updates to master.
# Note: Please use a cron on this every x minutes

# Make directory where script is current directory
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

shouldInstallNewCode=true

if [[ -z $(git rev-parse --is-inside-work-tree 2>/dev/null) ]]; then
  echo "Skipping code update, not in git repo."
  shouldInstallNewCode=false
fi

if [[ $(git status -s) ]]; then
  echo "Skipping code update, git status not clean."
  shouldInstallNewCode=false
fi

# Update remote before we check
git remote update

remoteCommits=$(git status -sb | grep "behind")
if [[ -z "$remoteCommits" ]]; then
  echo "No code changes were found on remote."
  shouldInstallNewCode=false
fi

# Install new code
if $shouldInstallNewCode ; then
  # Stop the container if there is any running
  echo "Stopping container..."
  docker-compose down --rmi all || true

  # Pull down new code
  echo "Pulling new code.."
  git pull origin

  # Start up container again
  echo "Restarting container..."
  docker-compose pull --include-deps
  docker-compose up -d --build --force-recreate --remove-orphans
fi

# If service is not up, start it
service=$(basename "$PWD")
hasContainerRunning=$(docker ps | grep "$service")
if [[ -z "$hasContainerRunning" ]]; then
  echo "Starting container..."
  docker-compose pull --include-deps
  docker-compose up -d --build --force-recreate --remove-orphans
fi
