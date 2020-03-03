# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
