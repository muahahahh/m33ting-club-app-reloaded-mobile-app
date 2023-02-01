#!/usr/bin/env bash
set -e
set -x
echo "$APPCENTER_BRANCH"
if [ "$APPCENTER_BRANCH" == 'prod' ]; then
  echo 'Its production!'
  #here you can do stuff for master, like injecting keys, etc.
else
  # we do the same for Android
  echo 'copying Android debug Firebase file into release folder, so analytics uses the Dev file'
  cp -rf "android/app/src/debug/google-services.json" "android/app/src/release/google-services.json"
fi
