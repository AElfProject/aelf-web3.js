
#!/bin/bash
sudo apt-get update
echo '----apt-get install nodejs npm -y------'
sudo  apt-get install nodejs npm -y
npm -v
node -v
echo '-----sudo npm install -g npm-cli-login--------'
sudo npm install -g npm-cli-login
echo '-----sudo npm install -g npm-cli-login--------'
npm-cli-login -u "$1"  -p "$2" -e "$3"
npm publish
