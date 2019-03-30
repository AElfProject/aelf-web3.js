<a name="module_Aelf/wallet"></a>

## Aelf/wallet
wallet module.


* [Aelf/wallet](#module_Aelf/wallet)
    * [AESEncrypto(input, password)](#exp_module_Aelf/wallet--AESEncrypto) ⇒ <code>string</code> ⏏
    * [AESDecrypto(input, password)](#exp_module_Aelf/wallet--AESDecrypto) ⇒ <code>string</code> ⏏
    * [getAddressFromPubKey(pubKey)](#exp_module_Aelf/wallet--getAddressFromPubKey) ⇒ <code>string</code> ⏏
    * [createNewWallet()](#exp_module_Aelf/wallet--createNewWallet) ⇒ <code>Object</code> ⏏
    * [getWalletByMnemonic(mnemonic)](#exp_module_Aelf/wallet--getWalletByMnemonic) ⇒ <code>Object</code> ⏏
    * [getWalletByPrivateKey(privateKey)](#exp_module_Aelf/wallet--getWalletByPrivateKey) ⇒ <code>Object</code> ⏏
    * [signTransaction(rawTxn, keyPair)](#exp_module_Aelf/wallet--signTransaction) ⇒ <code>Object</code> ⏏
    * [sign(hexTxn, keyPair)](#exp_module_Aelf/wallet--sign) ⇒ <code>Buffer</code> ⏏

<a name="exp_module_Aelf/wallet--AESEncrypto"></a>

### AESEncrypto(input, password) ⇒ <code>string</code> ⏏
Advanced Encryption Standard need crypto-js

**Kind**: Exported function  
**Returns**: <code>string</code> - crypted input  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> | anything you want to encrypt |
| password | <code>string</code> | password |

**Example**  
```js
const AESEncryptoPrivateKey = aelf.wallet.AESEncrypto('123', '123');
const AESEncryptoMnemonic = alef.wallet.AESEncrypto('hello world', '123');
```
<a name="exp_module_Aelf/wallet--AESDecrypto"></a>

### AESDecrypto(input, password) ⇒ <code>string</code> ⏏
Decrypt any encrypted information you want to decrypt

**Kind**: Exported function  
**Returns**: <code>string</code> - decrypted input  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> | anything you want to decrypt |
| password | <code>string</code> | password |

**Example**  
```js
const AESDecryptoPrivateKey = aelf.wallet.AESDecrypto('U2FsdGVkX18+tvF7t4rhGOi5cbUvdTH2U5a6Tbu4Ojg=', '123');
const AESDecryptoMnemonic = aelf.wallet.AESDecrypto('U2FsdGVkX19gCjHzYmoY5FGZA1ArXG+eGZIR77dK2GE=', '123');
```
<a name="exp_module_Aelf/wallet--getAddressFromPubKey"></a>

### getAddressFromPubKey(pubKey) ⇒ <code>string</code> ⏏
the same as in C#

**Kind**: Exported function  
**Returns**: <code>string</code> - address encoded address  

| Param | Type | Description |
| --- | --- | --- |
| pubKey | <code>Object</code> | get the pubKey you want through keyPair |

**Example**  
```js
const keyPair = a: {
    ec: c {curve: c, n: a, nh: a, g: u, hash: ƒ}
    priv: a {negative: 0, words: Array(11), length: 10, red: null}
    pub: u {curve: c, type: "affine", precomputed: null, x: a, y: a, …}
 }
const pubKey = keyPair.getPublic();
const address = aelf.wallet.getAddressFromPubKey(pubKey);
```
<a name="exp_module_Aelf/wallet--createNewWallet"></a>

### createNewWallet() ⇒ <code>Object</code> ⏏
create a wallet

**Kind**: Exported function  
**Returns**: <code>Object</code> - wallet  
**Example**  
```js
const wallet = aelf.wallet.createNewWallet();
```
<a name="exp_module_Aelf/wallet--getWalletByMnemonic"></a>

### getWalletByMnemonic(mnemonic) ⇒ <code>Object</code> ⏏
create a wallet by mnemonic

**Kind**: Exported function  
**Returns**: <code>Object</code> - wallet  

| Param | Type | Description |
| --- | --- | --- |
| mnemonic | <code>string</code> | base on bip39 |

**Example**  
```js
const mnemonicWallet = aelf.wallet.getWalletByMnemonic('hallo world');
```
<a name="exp_module_Aelf/wallet--getWalletByPrivateKey"></a>

### getWalletByPrivateKey(privateKey) ⇒ <code>Object</code> ⏏
create a wallet by private key

**Kind**: Exported function  
**Returns**: <code>Object</code> - wallet  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | privateKey |

**Example**  
```js
const privateKeyWallet = aelf.wallet.getWalletByPrivateKey('123');
```
<a name="exp_module_Aelf/wallet--signTransaction"></a>

### signTransaction(rawTxn, keyPair) ⇒ <code>Object</code> ⏏
sign a transaction

**Kind**: Exported function  
**Returns**: <code>Object</code> - wallet  

| Param | Type | Description |
| --- | --- | --- |
| rawTxn | <code>Object</code> | rawTxn |
| keyPair | <code>Object</code> | any keypair that meets the criteria |

**Example**  
```js
const keyPair = a: {
    ec: c {curve: c, n: a, nh: a, g: u, hash: ƒ}
    priv: a {negative: 0, words: Array(11), length: 10, red: null}
    pub: u {curve: c, type: "affine", precomputed: null, x: a, y: a, …}
 }
const rawTxn = proto.getTransaction('ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9', 'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9', 'test', []);
const wallet = aelf.wallet.signTransaction(rawTxn, keyPair);
```
<a name="exp_module_Aelf/wallet--sign"></a>

### sign(hexTxn, keyPair) ⇒ <code>Buffer</code> ⏏
just sign

**Kind**: Exported function  
**Returns**: <code>Buffer</code> - Buffer.from(hex, 'hex')  

| Param | Type | Description |
| --- | --- | --- |
| hexTxn | <code>string</code> | hex string |
| keyPair | <code>Object</code> | any keypair that meets the criteria |

**Example**  
```js
const keyPair = a: {
    ec: c {curve: c, n: a, nh: a, g: u, hash: ƒ}
    priv: a {negative: 0, words: Array(11), length: 10, red: null}
    pub: u {curve: c, type: "affine", precomputed: null, x: a, y: a, …}
 }
aelf.wallet.sign('68656c6c6f20776f726c64', keyPair);
```
