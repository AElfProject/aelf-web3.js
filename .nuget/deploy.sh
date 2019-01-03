#!/bin/bash

HERE=$(cd "$(dirname "$0")";pwd)
cd ${HERE}

TAG=$1
NUGET_API_KEY=$2

# TODO: verify version
VERSION=`echo $TAG | cut -b 2-`

NUPKG="${HERE}/Rosona.JSDK.${VERSION}.nupkg"

# build
mkdir AElf.JSDK/content
cp -r ../dist/* AElf.JSDK/content/
dotnet build AElf.JSDK/AElf.JSDK.csproj --configuration Release -P:Version=${VERSION} -o ../

if [ ! -f "${NUPKG}" ]; then
    echo "package not exist: ${NUPKG}"
    exit 1
fi

# publish
dotnet nuget push ${NUPKG} -k ${NUGET_API_KEY} -s https://api.nuget.org/v3/index.json
