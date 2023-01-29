# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.2.43](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.41...v3.2.43) (2023-01-29)


### Features

* add main.yml ([6ec3b2f](https://github.com/AElfProject/aelf-sdk.js/commit/6ec3b2f0af1c8e9d723cbb80a9984673d96b4d71))


### Bug Fixes

* 🐛 support enum ([9e95910](https://github.com/AElfProject/aelf-sdk.js/commit/9e959107621abcbbfae94fd070b6e5eae99d582e))

### [3.2.41](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.40...v3.2.41) (2022-11-17)


### Features

* 🎸 change XHR to Fetch on browser ([3fdc189](https://github.com/AElfProject/aelf-sdk.js/commit/3fdc1890eabe05c1f98fa16dc3dde97d0c2c4b06))


### Bug Fixes

* 🐛 fix fetch error result and host url ([4463499](https://github.com/AElfProject/aelf-sdk.js/commit/44634999bef929fb1f358d9a76692bf9ff6ef1e3))
* 🐛 format variable names ([0595ca6](https://github.com/AElfProject/aelf-sdk.js/commit/0595ca68eb2f5932f1f54956dd9ad565efde7ba0))

### [3.2.40](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.39...v3.2.40) (2022-02-09)


### Bug Fixes

* 🐛 chainApi test case ([42a9c1e](https://github.com/AElfProject/aelf-sdk.js/commit/42a9c1e9b4b589d9921ddbf346ac71b56fafff92))

### [3.2.39](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.38...v3.2.39) (2021-08-27)


### Features

* 🎸 add authorization  ([b04c1db](https://github.com/AElfProject/aelf-sdk.js/commit/b04c1db9182df17c30d4bb37ae8971efcba6621b))

### [3.2.38](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.37...v3.2.38) (2021-03-09)


### Features

* 🎸 add signed transaction deserializing ([53d4724](https://github.com/AElfProject/aelf-sdk.js/commit/53d47241ee7311f63efea18274d20824d4e08c0f))

### [3.2.37](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.36...v3.2.37) (2020-12-28)


### Bug Fixes

* 🐛 fix enum type resolve ([d13d2ee](https://github.com/AElfProject/aelf-sdk.js/commit/d13d2ee))



### [3.2.36](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.35...v3.2.36) (2020-12-26)


### Bug Fixes

* 🐛 handle no-value decode and encode when occur complex obj ([43eab80](https://github.com/AElfProject/aelf-sdk.js/commit/43eab80))



### [3.2.35](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.34...v3.2.35) (2020-12-02)


### Bug Fixes

* 🐛 use browserify-aes MODES config ([75a8a75](https://github.com/AElfProject/aelf-sdk.js/commit/75a8a75))



### [3.2.34](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.33...v3.2.34) (2020-05-21)



### [3.2.33](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.32...v3.2.33) (2020-04-15)


### Bug Fixes

* 🐛 fix private key length when first byte is 0 ([85ea98a](https://github.com/AElfProject/aelf-sdk.js/commit/85ea98a))



### [3.2.32](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.31...v3.2.32) (2020-03-30)


### Bug Fixes

* 🐛 add default value ([d6aa193](https://github.com/AElfProject/aelf-sdk.js/commit/d6aa193))



### [3.2.31](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.30...v3.2.31) (2020-03-27)


### Features

* 🎸 change proto ([7f8cc91](https://github.com/AElfProject/aelf-sdk.js/commit/7f8cc91))



### [3.2.30](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.29...v3.2.30) (2020-03-12)


### Features

* 🎸 add deserialize fee ([337d7f7](https://github.com/AElfProject/aelf-sdk.js/commit/337d7f7))
* 🎸 add fee type and export unpackOutput ([780e8ff](https://github.com/AElfProject/aelf-sdk.js/commit/780e8ff))
* 🎸 pbUtils add deserializeTransactionFee ([c355084](https://github.com/AElfProject/aelf-sdk.js/commit/c355084))



### [3.2.29](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.28...v3.2.29) (2020-03-05)


### Features

* 🎸 add bloom filter ([abda0be](https://github.com/AElfProject/aelf-sdk.js/commit/abda0be))



### [3.2.28](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.27...v3.2.28) (2020-03-03)


### Features

* 🎸 add new contract method for deserialize logs ([c8757f4](https://github.com/AElfProject/aelf-sdk.js/commit/c8757f4))



### [3.2.27](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.26...v3.2.27) (2020-03-03)


### Bug Fixes

* fix complicated protobuf Address/Hash/Map fields ([30d96c6](https://github.com/AElfProject/aelf-sdk.js/commit/30d96c6))



### [3.2.26](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.25...v3.2.26) (2020-01-09)


### Bug Fixes

* 🐛 fix nested protobuf serialize and deserialize error ([c922f38](https://github.com/AElfProject/aelf-sdk.js/commit/c922f38))



### [3.2.25](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.24...v3.2.25) (2020-01-04)


### Features

* 🎸 modify chain API methods ([e3183aa](https://github.com/AElfProject/aelf-sdk.js/commit/e3183aa))



### [3.2.24](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.23...v3.2.24) (2019-12-27)


### Bug Fixes

* 🐛 fix aelf.Hash deserialize bug ([5e108eb](https://github.com/AElfProject/aelf-sdk.js/commit/5e108eb))



### [3.2.23](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.22...v3.2.23) (2019-12-02)


### Features

* 🎸 add address with _ formatter ([4bd7102](https://github.com/AElfProject/aelf-sdk.js/commit/4bd7102))



### [3.2.22](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.21...v3.2.22) (2019-11-30)


### Bug Fixes

* 🐛 remove sync timeout when some browsers throw an error ([7e95168](https://github.com/AElfProject/aelf-sdk.js/commit/7e95168))



### [3.2.21](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.19...v3.2.21) (2019-11-20)


### Bug Fixes

* 🐛 remove useless arguments of HttpProvider ([6a5894a](https://github.com/AElfProject/aelf-sdk.js/commit/6a5894a))


### Features

* 🎸 we can get getRawTx by three params ([4d71c2a](https://github.com/AElfProject/aelf-sdk.js/commit/4d71c2a))



### [3.2.20](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.19...v3.2.20) (2019-11-19)


### Features

* 🎸 we can get getRawTx by three params ([4d71c2a](https://github.com/AElfProject/aelf-sdk.js/commit/4d71c2a))



### [3.2.19](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.18...v3.2.19) (2019-11-01)


### Bug Fixes

* 🐛 add condition hanler for repeated aelf.Address ([94fdbc3](https://github.com/AElfProject/aelf-sdk.js/commit/94fdbc3))



### [3.2.18](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.17...v3.2.18) (2019-10-16)


### Features

* 🎸 Compatible with the case param is hex formated ([3d953f4](https://github.com/AElfProject/aelf-sdk.js/commit/3d953f4))
* 🎸 Export method getAddressFromPubKey ([e3d5a28](https://github.com/AElfProject/aelf-sdk.js/commit/e3d5a28))



### [3.2.17](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.16...v3.2.17) (2019-09-24)


### Bug Fixes

* 🐛 add scrypt config ([9523dbd](https://github.com/AElfProject/aelf-sdk.js/commit/9523dbd))
* 🐛 fix keyStore params ([da201a4](https://github.com/AElfProject/aelf-sdk.js/commit/da201a4))



### [3.2.16](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.15...v3.2.16) (2019-09-20)


### Bug Fixes

* 🐛 set readInt32LE(offset) offset=0 ([4d42b6c](https://github.com/AElfProject/aelf-sdk.js/commit/4d42b6c))


### Features

* 🎸 add get current round information method ([6d8529e](https://github.com/AElfProject/aelf-sdk.js/commit/6d8529e))
* 🎸 exposed packinput method ([4524b00](https://github.com/AElfProject/aelf-sdk.js/commit/4524b00))



### [3.2.15](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.14...v3.2.15) (2019-09-06)


### Bug Fixes

* set readInt32LE(offset) offset=0 ([4d42b6c](https://github.com/AElfProject/aelf-sdk.js/commit/4d42b6c))



### [3.2.14](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.13...v3.2.14) (2019-09-02)


### Bug Fixes

* bug when getMerklePath, add sync:true; update README ([43afff4](https://github.com/AElfProject/aelf-sdk.js/commit/43afff4))


### Features

* 🎸 add chain method getMerklePathByTxId ([c45f492](https://github.com/AElfProject/aelf-sdk.js/commit/c45f492))
* 🎸 add example for crossChain ([0450e5c](https://github.com/AElfProject/aelf-sdk.js/commit/0450e5c))
* 🎸 bind new one method and two object to contractMethod ([785b279](https://github.com/AElfProject/aelf-sdk.js/commit/785b279))
* add chainIdConvertor in utils; add getSignedTx  in contractMethod.js ([be2f031](https://github.com/AElfProject/aelf-sdk.js/commit/be2f031))



### [3.2.13](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.12...v3.2.13) (2019-08-19)


### Features

* 🎸 remove c++ version scrypt ([1d84266](https://github.com/AElfProject/aelf-sdk.js/commit/1d84266))



### [3.2.12](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.10...v3.2.12) (2019-08-09)


### Bug Fixes

* 🐛 fix install scrypt error in Node v12 ([effaea1](https://github.com/AElfProject/aelf-sdk.js/commit/effaea1)), closes [#51](https://github.com/AElfProject/aelf-sdk.js/issues/51)
* 🐛 fix keystore options ([e09a976](https://github.com/AElfProject/aelf-sdk.js/commit/e09a976))



### [3.2.11](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.10...v3.2.11) (2019-07-25)


### Bug Fixes

* 🐛 fix install scrypt error in Node v12 ([effaea1](https://github.com/AElfProject/aelf-sdk.js/commit/effaea1)), closes [#51](https://github.com/AElfProject/aelf-sdk.js/issues/51)



### [3.2.10](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.9...v3.2.10) (2019-07-17)


### Features

* 🎸 rewrite keyStore generate and resolve ([6ed2b5d](https://github.com/AElfProject/aelf-sdk.js/commit/6ed2b5d))



### [3.2.9](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.8...v3.2.9) (2019-07-16)


### Bug Fixes

* 🐛 fix multi-request share the same xhr instance ([b7a20eb](https://github.com/AElfProject/aelf-sdk.js/commit/b7a20eb))



### [3.2.8](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.7...v3.2.8) (2019-07-15)


### Bug Fixes

* 🐛 fix toString error ([8f0da78](https://github.com/AElfProject/aelf-sdk.js/commit/8f0da78))


### Features

* 🎸 add compile env variables for import correct xhr lib ([a767bd6](https://github.com/AElfProject/aelf-sdk.js/commit/a767bd6))



### [3.2.7](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.6...v3.2.7) (2019-07-13)


### Bug Fixes

* 🐛 fix params callback ([a1dd255](https://github.com/AElfProject/aelf-sdk.js/commit/a1dd255))



### [3.2.6](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.5...v3.2.6) (2019-07-13)


### Bug Fixes

* 🐛 fix params ([fbbe6bf](https://github.com/AElfProject/aelf-sdk.js/commit/fbbe6bf))



### [3.2.5](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.4...v3.2.5) (2019-07-13)


### Bug Fixes

* 🐛 fix empty params ([1b268a7](https://github.com/AElfProject/aelf-sdk.js/commit/1b268a7))



### [3.2.4](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.3...v3.2.4) (2019-07-13)


### Bug Fixes

* 🐛 fix callback paramaters ([b8ee2ac](https://github.com/AElfProject/aelf-sdk.js/commit/b8ee2ac))



### [3.2.3](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.0...v3.2.3) (2019-07-13)


### Bug Fixes

* 🐛 fix a bip39 breaking changed method ([28a09ad](https://github.com/AElfProject/aelf-sdk.js/commit/28a09ad))
* 🐛 throw full response body when an error response happened ([eff374b](https://github.com/AElfProject/aelf-sdk.js/commit/eff374b))


### Features

* 🎸 add support for custom address with `_` symbol ([1f69bb2](https://github.com/AElfProject/aelf-sdk.js/commit/1f69bb2))
* 🎸 Combine two chain methods into one ([d01b90e](https://github.com/AElfProject/aelf-sdk.js/commit/d01b90e)), closes [#45](https://github.com/AElfProject/aelf-sdk.js/issues/45)



### [3.2.2](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.0...v3.2.2) (2019-07-12)


### Bug Fixes

* 🐛 fix a bip39 breaking changed method ([28a09ad](https://github.com/AElfProject/aelf-sdk.js/commit/28a09ad))
* 🐛 throw full response body when an error response happened ([eff374b](https://github.com/AElfProject/aelf-sdk.js/commit/eff374b))



### [3.2.1](https://github.com/AElfProject/aelf-sdk.js/compare/v3.2.0...v3.2.1) (2019-07-11)


### Bug Fixes

* 🐛 throw full response body when an error response happened ([eff374b](https://github.com/AElfProject/aelf-sdk.js/commit/eff374b))



## [3.2.0](https://github.com/AElfProject/aelf-sdk.js/compare/v2.1.19...v3.2.0) (2019-07-10)


### Bug Fixes

* 🐛 fix the value of AElf instance version.api ([8931ff1](https://github.com/AElfProject/aelf-sdk.js/commit/8931ff1))
