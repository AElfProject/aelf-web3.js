#!/bin/bash
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
npm_path=`which npm`
sudo $npm_path  install -g npm-cli-login
npm-cli-login -u "$1"  -p "$2" -e "$3"
npm publish
