# aelf-sdk.js - AELF JavaScript API

[![Build Status][1]][2]

[1]: https://travis-ci.org/AElfProject/aelf-sdk.js.svg?branch=master
[2]: https://travis-ci.org/AElfProject/aelf-sdk.js

## 1. Introduction

aelf-sdk.js for aelf is like web.js for ethereum.

aelf-sdk.js is a collection of libraries which allow you to interact with a local or remote aelf node, using a HTTP connection.

The following documentation will guide you through installing and running aelf-sdk.js, as well as providing a API reference documentation with examples.

You can get some codes in the [./examples](./examples) directory

## 2. Getting Started

### 2.1 Adding aelf-sdk.js

First you need to get aelf-sdk.js into your project. This can be done using the following methods:

npm: `npm install aelf-sdk`

pure js: `link dist/aelf.umd.js`

After that you need to create a aelf instance and set a provider.

```js
// 1.In node.js use: const AElf = require('aelf-sdk');
// 2.FrontEnd freshman, add following tag in html
// <script src="https://unpkg.com/aelf-sdk@lastest/dist/aelf.umd.js"></script>
const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:8000'));
```

### 2.2 Detail information for library files

You can skip 2.2 as 2.1 is enough now.

In our dist directory, we supply two kinds of packages for different platforms, such as Node and Browser.

| packages         | usage                                                        |
| ---------------- | ------------------------------------------------------------ |
| dist/aelf.cjs.js | built for node, remove node built-in modules such as crypto. |
| dist/aelf.umd.js | built for browser, add some node built-in modules by webpack |

You can choose any packages based on your need, for examples:

if you are new to FrontEnd, you can use `AElf-sdk` by add a script tag in your html files.

```html
<!-- minified version with UMD module -->
<script src="https://unpkg.com/aelf-sdk@lastest/dist/aelf.umd.js"></script>
```

if you want to use a bundle system such as webpack or rollup, and build your applications for Node.js and Browsers, just import the specified version of package files.

#### For browser usage and use UMD

Webpack:

```javascript
module.exports = {
  // ...
  resolve: {
    alias: {
      'aelf-sdk$': 'aelf-sdk/dist/aelf.umd.js'
    }
  }
};
```

Rollup:

```javascript
const alias = require('rollup-plugin-alias');

rollup({
  // ...
  plugins: [
    alias({
      'aelf-sdk': require.resolve('aelf-sdk/dist/aelf.umd.js')
    })
  ]
});
```

#### For Node.js usage and use commonjs module system

Webpack:

```javascript
module.exports = {
  // ...
  resolve: {
    alias: {
      'aelf-sdk$': 'aelf-sdk/dist/aelf.cjs.js'
    }
  }
};
```

Rollup:

```javascript
const alias = require('rollup-plugin-alias');

rollup({
  // ...
  plugins: [
    alias({
      'aelf-sdk': require.resolve('aelf-sdk/dist/aelf.cjs.js')
    })
  ]
});
```

## 3. Basic usage

### 3.1 Examples

You can also see full examples in [./examples](./examples);

1. Create a new instance of AElf, connect to an AELF chain node.

   ```javascript
   import AElf from 'aelf-sdk';

   // create a new instance of AElf
   const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:1235'));
   ```

2. Create or load a wallet with `AElf.wallet`

   ```javascript
   // create a new wallet
   const newWallet = AElf.wallet.createNewWallet();
   // load a wallet by private key
   const priviteKeyWallet = AElf.wallet.getWalletByPrivateKey('xxxxxxx');
   // load a wallet by mnemonic
   const mnemonicWallet = AElf.wallet.getWalletByMnemonic('set kite ...');
   ```

3. Get a system contract address, take `AElf.ContractNames.Token` as an example

   ```javascript
   const tokenContractName = 'AElf.ContractNames.Token';
   let tokenContractAddress;
   (async () => {
     // get chain status
     const chainStatus = await aelf.chain.getChainStatus();
     // get genesis contract address
     const GenesisContractAddress = chainStatus.GenesisContractAddress;
     // get genesis contract instance
     const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, newWallet);
     // Get contract address by the read only method `GetContractAddressByName` of genesis contract
     tokenContractAddress = await zeroContract.GetContractAddressByName.call(AElf.utils.sha256(tokenContractName));
   })();
   ```

4. Get a contract instance by contract address

   ```javascript
   const wallet = AElf.wallet.createNewWallet();
   let tokenContract;
   // Use token contract for examples to demonstrate how to get a contract instance in different ways
   // in async function
   (async () => {
     tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet);
   })();

   // promise way
   aelf.chain.contractAt(tokenContractAddress, wallet).then((result) => {
     tokenContract = result;
   });

   // callback way
   aelf.chain.contractAt(tokenContractAddress, wallet, (error, result) => {
     if (error) throw error;
     tokenContract = result;
   });
   ```

5. How to use contract instance

   A contract instance consists of several contract methods and methods can be called in two ways: read-only and send transaction.

   ```javascript
   (async () => {
     // get the balance of an address, this would not send a transaction,
     // or store any data on the chain, or required any transaction fee, only get the balance
     // with `.call` method, `aelf-sdk` will only call read-only method
     const result = await tokenContract.GetBalance.call({
       symbol: 'ELF',
       owner: '7s4XoUHfPuqoZAwnTV7pHWZAaivMiL8aZrDSnY9brE1woa8vz'
     });
     console.log(result);
     /**
     {
       "symbol": "ELF",
       "owner": "2661mQaaPnzLCoqXPeys3Vzf2wtGM1kSrqVBgNY4JUaGBxEsX8",
       "balance": "1000000000000"
     }*/
     // with no `.call`, `aelf-sdk` will sign and send a transaction to the chain, and return a transaction id.
     // make sure you have enough transaction fee `ELF` in your wallet
     const transactionId = await tokenContract.Transfer({
       symbol: 'ELF',
       to: '7s4XoUHfPuqoZAwnTV7pHWZAaivMiL8aZrDSnY9brE1woa8vz',
       amount: '1000000000',
       memo: 'transfer in demo'
     });
     console.log(transactionId);
     /**
       {
         "TransactionId": "123123"
       }
     */
   })();
   ```

6. Change the node endpoint by using `aelf.setProvider`

   ```javascript
   import AElf from 'aelf-sdk';

   const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:1235'));
   aelf.setProvider(new AElf.providers.HttpProvider('http://127.0.0.1:8000'));
   ```

### 3.2 Web API

_You can see how the Web Api of the node works in `{chainAddress}/swagger/index.html`_
_tip: for an example, my local address: 'http://127.0.0.1:1235/swagger/index.html'_

parameters and returns based on the URL: `https://aelf-public-node.aelf.io/swagger/index.html`

The usage of these methods is based on the AElf instance, so if you don't have one please create it:

```javascript
import AElf from 'aelf-sdk';

// create a new instance of AElf, change the URL if needed
const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:1235'));
```

#### getChainStatus

Get the current status of the block chain.

_Web API path_

`/api/blockChain/chainStatus`

_Parameters_

Empty

_Returns_

`Object`

- `ChainId - String`
- `Branches - Object`
- `NotLinkedBlocks - Object`
- `LongestChainHeight - Number`
- `LongestChainHash - String`
- `GenesisBlockHash - String`
- `GenesisContractAddress - String`
- `LastIrreversibleBlockHash - String`
- `LastIrreversibleBlockHeight - Number`
- `BestChainHash - String`
- `BestChainHeight - Number`

_Example_

```javascript
aelf.chain.getChainStatus().then((res) => {
  console.log(res);
});
```

#### getContractFileDescriptorSet

Get the protobuf definitions related to a contract

_Web API path_

`/api/blockChain/contractFileDescriptorSet`

_Parameters_

1. `contractAddress - String` address of a contract

_Returns_

`String`

_Example_

```javascript
aelf.chain.getContractFileDescriptorSet(contractAddress).then((res) => {
  console.log(res);
});
```

#### getBlockHeight

Get current best height of the chain.

_Web API path_

`/api/blockChain/blockHeight`

_Parameters_

Empty

_Returns_

`Number`

_Example_

```javascript
aelf.chain.getBlockHeight().then((res) => {
  console.log(res);
});
```

#### getBlock

Get block information by block hash.

_Web API path_

`/api/blockChain/block`

_Parameters_

1. `blockHash - String`
2. `includeTransactions - Boolean` :

- `true` require transaction ids list in the block
- `false` Doesn't require transaction ids list in the block

_Returns_

`Object`

- `BlockHash - String`
- `Header - Object`
  - `PreviousBlockHash - String`
  - `MerkleTreeRootOfTransactions - String`
  - `MerkleTreeRootOfWorldState - String`
  - `Extra - Array`
  - `Height - Number`
  - `Time - google.protobuf.Timestamp`
  - `ChainId - String`
  - `Bloom - String`
  - `SignerPubkey - String`
- `Body - Object`
  - `TransactionsCount - Number`
  - `Transactions - Array`
    - `transactionId - String`

_Example_

```javascript
aelf.chain.getBlock(blockHash, false).then((res) => {
  console.log(res);
});
```

#### getBlockByHeight

_Web API path_

`/api/blockChain/blockByHeight`

Get block information by block height.

_Parameters_

1. `blockHeight - Number`
2. `includeTransactions - Boolean` :

- `true` require transaction ids list in the block
- `false` Doesn't require transaction ids list in the block

_Returns_

`Object`

- `BlockHash - String`
- `Header - Object`
  - `PreviousBlockHash - String`
  - `MerkleTreeRootOfTransactions - String`
  - `MerkleTreeRootOfWorldState - String`
  - `Extra - Array`
  - `Height - Number`
  - `Time - google.protobuf.Timestamp`
  - `ChainId - String`
  - `Bloom - String`
  - `SignerPubkey - String`
- `Body - Object`
  - `TransactionsCount - Number`
  - `Transactions - Array`
    - `transactionId - String`

_Example_

```javascript
aelf.chain.getBlockByHeight(12, false).then((res) => {
  console.log(res);
});
```

#### getTxResult

Get the result of a transaction

_Web API path_

`/api/blockChain/transactionResult`

_Parameters_

1. `transactionId - String`

_Returns_

`Object`

- `TransactionId - String`
- `Status - String`
- `Logs - Array`
  - `Address - String`
  - `Name - String`
  - `Indexed - Array`
  - `NonIndexed - String`
- `Bloom - String`
- `BlockNumber - Number`
- `Transaction - Object`
  - `From - String`
  - `To - String`
  - `RefBlockNumber - Number`
  - `RefBlockPrefix - String`
  - `MethodName - String`
  - `Params - Object`
  - `Signature - String`
- `ReadableReturnValue - Object`
- `Error - String`

_Example_

```javascript
aelf.chain.getTxResult(transactionId).then((res) => {
  console.log(res);
});
```

#### getTxResults

Get multiple transaction results in a block

_Web API path_

`/api/blockChain/transactionResults`

_Parameters_

1. `blockHash - String`
2. `offset - Number`
3. `limit - Number`

_Returns_
`Array` - The array of method descriptions:

- the transaction result object

_Example_

```javascript
aelf.chain.getTxResults(blockHash, 0, 2).then((res) => {
  console.log(res);
});
```

#### getTransactionPoolStatus

Get the transaction pool status.

_Web API path_

`/api/blockChain/transactionPoolStatus`

_Parameters_

Empty

#### sendTransaction

Broadcast a transaction

_Web API path_

`/api/blockChain/sendTransaction`

_POST_

_Parameters_

`Object` - Serialization of data into protobuf data, The object with the following structure :

- `RawTransaction - String` :

usually developers don't need to use this function directly, just get a contract method and send transaction by call contract method:

#### sendTransactions

Broadcast multiple transactions

_POST_

_Parameters_

`Object` - The object with the following structure :

- `RawTransaction - String`

#### calculateTransactionFee

Estimate transaction fee

_Web API path_

`/api/blockChain/calculateTransactionFee`

_POST_

_Parameters_

`Object` - The object with the following structure :

- `RawTransaction - String`

#### callReadOnly

Call a read-only method on a contract.

_POST_

_Parameters_

`Object` - The object with the following structure :

- `RawTransaction - String`

#### getPeers

Get peer info about the connected network nodes

#### addPeer

Attempts to add a node to the connected network nodes

you need to create a aelf authorization instance and set a provider

```javascript
const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:8000', 8000, { Authorization: AElf.utils.getAuthorization('UseName', 'Password') }));
```

_Example_

```javascript
const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:8000', 8000, { Authorization: AElf.utils.getAuthorization('aelf', '12345678') }));

aelf.chain.addPeer('192.168.11.140:6801').then((res) => {
  console.log(res);
});
```

#### removePeer

Attempts to remove a node from the connected network nodes

you need to create a aelf authorization instance and set a provider

```javascript
const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:8000', 8000, { Authorization: AElf.utils.getAuthorization('UseName', 'Password') }));
```

_Example_

```javascript
const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:8000', 8000, { Authorization: AElf.utils.getAuthorization('aelf', '12345678') }));

aelf.chain.removePeer('192.168.11.140:6801').then((res) => {
  console.log(res);
});
```

#### networkInfo

Get information about the node’s connection to the network

### 3.3 AElf.wallet

`AElf.wallet` is a static property of `AElf`.

_Use the api to see detailed results_

#### createNewWallet

_Returns_

`Object`

- `mnemonic - String`: mnemonic
- `BIP44Path - String`: m/purpose'/coin_type'/account'/change/address_index
- `childWallet - Object`: HD Wallet
- `keyPair - String`: The EC key pair generated by elliptic
- `privateKey - String`: private Key
- `address - String`: address

_Example_

```javascript
import AElf from 'aelf-sdk';
const wallet = AElf.wallet.createNewWallet();
```

#### getWalletByMnemonic

_Parameters_

1. `mnemonic - String` : wallet's mnemonic

_Returns_

`Object`: Complete wallet object.

_Example_

```javascript
const wallet = AElf.wallet.getWalletByMnemonic(mnemonic);
```

#### getWalletByPrivateKey

_Parameters_

1.  `privateKey: String` : wallet's private key

_Returns_

`Object`: Complete wallet object, with empty mnemonic

_Example_

```javascript
const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
```

#### signTransaction

Use wallet `keypair` to sign a transaction

_Parameters_

1. `rawTxn - String`
2. `keyPair - String`

_Returns_

`Object`: The object with the following structure :

_Example_

```javascript
const result = AElf.wallet.signTransaction(rawTxn, keyPair);
```

#### AESEncrypt

Encrypt a string by aes algorithm

_Parameters_

1. `input - String`
2. `password - String`

_Returns_

`String`

#### AESDecrypt

Decrypt by aes algorithm

_Parameters_

1. `input - String`
2. `password - String`

_Returns_

`String`

### 3.4 AElf.pbjs

Simple example in [how to use aelf.pbjs](./examples/aelf-pbjs/how-to-use-aelf-pbjs.js);

The reference to protobuf.js, read the [documentation](https://github.com/protobufjs/protobuf.js) to see how to use.

### 3.5 AElf.pbUtils

Some basic format methods about proto for aelf.

For more information, please see the code in [src/util/proto.js](./src/util/proto.js). It is simple and easy to understand.

### 3.6 AElf.utils

Some methods for aelf.

For more information, please see the code in [src/util/utils.js](./src/util/utils.js). It is simple and easy to understand.

#### 3.6.1 Check address

```javascript
const AElf = require('aelf-sdk');
const { base58 } = AElf.utils;
base58.decode('$addresss'); // throw error if invalid
```

### 3.7 AElf.version

```javascript
import AElf from 'aelf-sdk';
AElf.version; // eg. 3.2.23
```

### 3.8 Requirements

- [Node.js](https://nodejs.org)
- [NPM](http://npmjs.com/)

### 3.9 Support

![browsers](https://img.shields.io/badge/browsers-latest%202%20versions-brightgreen.svg)
![node](https://img.shields.io/badge/node->=10-green.svg)

## 4. About contributing

Read out [contributing guide](./.github/CONTRIBUTING.md)

## 5. About Version

https://semver.org/
