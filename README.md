[![Build Status][1]][2]

[1]: https://travis-ci.org/AElfProject/aelf-sdk.js.svg?branch=master
[2]: https://travis-ci.org/AElfProject/aelf-sdk.js

## aelf-sdk.js
AElf Javascript SDK

## support node & browser

## browser: need browserify or webpack ...
/output/aelf.web.js is for web.

browserify aelf.js > aelf.browserify.js

## Methods of Chain

```javascript
//https://github.com/AElfProject/AElf/wiki/JSON-RPC2#23-get-contract-abi---getcontractabi-address
getCommands,
connectChain,
getContractAbi,
getBlockHeight,
getBlockInfo,
getIncrement,
sendTransaction,
sendTransactions,
callReadOnly,
getTxResult,
getTxsResultByBlockhash,
getMerklePath,
checkProposal,
getTxPoolSize,
getDposStatus,
getNodeStatus,
getBlockStateSet,
getPeers,
addPeer,
removePeer
```

## pbjs
#### how to use pbjs convert proto to json.
node ./node_modules/protobufjs/bin/pbjs -t json ./lib/aelf/proto/abi.proto > ./lib/aelf/proto/abi.proto.json


## About Version
https://semver.org/
