# deploy.sh
# Use this script to start up. This will check to see if there are any updates to master.
# Note: Please use a cron on this every x minutes

shouldInstallNewCode=true

if [[ -z $(git rev-parse --is-inside-work-tree 2>/dev/null) ]]; then
  echo "Skipping code update, not in git repo."
  shouldInstallNewCode=false
fi

if [[ $(git status -s) ]]; then
  echo "Skipping code update, git status not clean."
  shouldInstallNewCode=false
fi

currentBranch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$currentBranch" != "master" ]]; then
  echo 'Skipping code update, not on master.'
  shouldInstallNewCode=false
fi

unpushedCommits=$(git log origin/master..master)
if [[ $unpushedCommits ]]; then
  echo "Skipping code update, master has unpushed commits"
  shouldInstallNewCode=false
fi