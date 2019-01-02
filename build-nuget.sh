
#!/bin/bash
sudo apt-get update
old_path=`pwd`
name=$1
sudo mkdir /test && cd /test
sudo curl -OL https://github.com/google/protobuf/releases/download/v3.6.0/protoc-3.6.0-linux-x86_64.zip
sudo apt-get install unzip
sudo unzip protoc-3.6.0-linux-x86_64.zip -d protoc3
sudo mv protoc3/bin/* /usr/local/bin/
sudo mv protoc3/include/* /usr/local/include/
echo 'protoc-------'
protoc --version
echo 'dotnet-------'
dotnet --version
echo 'nuget--------'
nuget

cd $old_path
sudo nuget pack ${name}.nuspec
ver=`cat ${name}.nuspec | grep \<version\>|awk -F[\>\<] '{print $3}'`
sudo nuget  push ${name}.${ver}.nupkg  $2  -src https://www.nuget.org
echo  '-----------------------------'
echo  '-----------------------------'
