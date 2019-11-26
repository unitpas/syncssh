#!/usr/bin/env bash

# Publishes syncssh to NPM based on the current version in package.json

set -e

rm -rf tempPublish
mkdir tempPublish

git clone git@github.com:unitpas/syncssh.git tempPublish
cd tempPublish
git checkout $npm_package_version

npm install

# courtesy of https://stackoverflow.com/a/3232082/3124288
read -r -p "Are you sure you want to publish version $npm_package_version? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
    yarn publish --tag latest
else
    echo "Publishing aborted"
fi

cd ..
rm -rf tempPublish