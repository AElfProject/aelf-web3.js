# aelf-sdk.js - AELF JavaScript API

[![Build Status][1]][2]

[1]: https://travis-ci.org/AElfProject/aelf-sdk.js.svg?branch=master
[2]: https://travis-ci.org/AElfProject/aelf-sdk.js

## Introduction

This is the AElf JavaScript API which connects to the Generic JSON RPC spec.

You need to run a local or remote AElf node to use this library.

Please read the ./docs for more.

Get the examples in the `./examples` directory

## Installation

### Script

```html
<!-- minified version with UMD module -->
<script src="https://unpkg.com/aelf-sdk@lastest/dist/aelf.umd.js"></script>
```

### Npm

```bash
npm install aelf-sdk
```

### Yarn

```bash
yarn add aelf-sdk
```

## Library files

In our dist directory, we support different packages for different platforms, such as Node and Browser.

packages | usage
---|---
dist/aelf.cjs.js | built for node, remove node-built modules such as crypto.
dist/aelf.umd.js | built for browser, add some node modules by webpack

You can choose any packages based on what you need, for examples:

if you are new to FrontEnd, you can use `AElf-sdk` by add a script tag in your html files.

```html
<!-- minified version with UMD module -->
<script src="https://unpkg.com/aelf-sdk@lastest/dist/aelf.umd.js"></script>
```

if you want to use a bundle system such as webpack or rollup, and build your applications for Node.js and Browsers, just import the specified version of package files.

### For browser usage and use UMD

Webpack:

```js
module.exports = {
  // ...
  resolve: {
    alias: {
      'aelf-sdk': 'aelf-sdk/dist/aelf.umd.js'
    }
  }
}
```

Rollup:

```js
const alias = require('rollup-plugin-alias');

rollup({
  // ...
  plugins: [
    alias({
      'aelf-sdk': require.resolve('aelf-sdk/dist/aelf.umd.js')
    })
  ]
})
```

### For Node.js usage and use commonjs module system

Webpack:

```js
module.exports = {
  // ...
  resolve: {
    alias: {
      'aelf-sdk': 'aelf-sdk/dist/aelf.cjs.js'
    }
  }
}
```

Rollup:

```js
const alias = require('rollup-plugin-alias');

rollup({
  // ...
  plugins: [
    alias({
      'aelf-sdk': require.resolve('aelf-sdk/dist/aelf.cjs.js')
    })
  ]
})
```

### Basic usage

```js
import AElf from 'aelf-sdk';

// simple
const aelf = new AElf(new AElf.providers.HttpProvider('https://127.0.0.1:8000'));
```

init contract and call methods. You can get more demos in ./examples.

```js
// tokenContractAddress = xxx; wallet = xxx;
// We use token contract for example.
// in async function
await aelf.chain.contractAt(tokenContractAddress, wallet);

// promise way
aelf.chain.contractAt(tokenContractAddress, wallet)
  .then(result => {});

// callback way
aelf.chain.contractAt(tokenContractAddress, wallet, (error, result) => {});
  
```

Additionally you can set a provider using aelf.setProvider()

```js
import AElf from 'aelf-sdk';

const aelf = new AElf(new AElf.providers.HttpProvider('https://127.0.0.1:8000'));
aelf.setProvider(new AElf.providers.HttpProvider('https://127.0.0.1:8010'));
```

### wallet

base on bip39.

```js
import AElf from 'aelf-sdk';

AElf.wallet.createNewWallet();
// wallet.AESDecrypto            wallet.AESEncrypto            wallet.bip39
// wallet.createNewWallet        wallet.getWalletByMnemonic    wallet.getWalletByPrivateKey
// wallet.sign                   wallet.signTransaction
```

### pbjs

almost the same as protobufjs

Sometimes we have to deal with some protobuf data.

### pbUtils

Some basic format methods of aelf.

For more information, please see the code in ./lib/aelf/proto.js. It is simple and easy to understand.

```js
    // methods.
    getRepForAddress
    getAddressFromRep
    getAddressObjectFromRep
    getRepForHash
    getHashFromHex
    getHashObjectFromHex
    getTransaction
    getMsigTransaction
    getAuthorization
    getReviewer
    encodeTransaction
    getProposal
    encodeProposal
    getApproval
    encodeApproval
    getSideChainInfo
    getBalance
    encodeSideChainInfo
    Transaction
    Hash
    Address
    Authorization
    Proposal
    ProposalStatus
    SideChainInfo
    SideChainStatus
    ResourceTypeBalancePair
```

### version

```js
import AElf from 'aelf-sdk';
AElf.version // eg. 2.1.10
```

## Contributing

- All contributions have to go into the dev-2.0 branch

- Please follow the code style of the other files, we use 4 spaces as tabs.

### Requirements

- [Node.js](https://nodejs.org)

- npm

### Support

![browsers](https://img.shields.io/badge/browsers-latest%202%20versions-brightgreen.svg)
![node](https://img.shields.io/badge/node->=6-green.svg)

## About contributing

Read out [contributing guide](./.github/CONTRIBUTING.md)

## About Version

https://semver.org/
