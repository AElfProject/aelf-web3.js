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
| input | <code>string</code> | input |
| password | <code>string</code> | password |

<a name="exp_module_Aelf/wallet--AESDecrypto"></a>

### AESDecrypto(input, password) ⇒ <code>string</code> ⏏
Decrypt message

**Kind**: Exported function  
**Returns**: <code>string</code> - decrypted input  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> | input |
| password | <code>string</code> | password |

<a name="exp_module_Aelf/wallet--getAddressFromPubKey"></a>

### getAddressFromPubKey(pubKey) ⇒ <code>string</code> ⏏
the same as in C#

**Kind**: Exported function  
**Returns**: <code>string</code> - address encoded address  

| Param | Type | Description |
| --- | --- | --- |
| pubKey | <code>Object</code> | input |

<a name="exp_module_Aelf/wallet--createNewWallet"></a>

### createNewWallet() ⇒ <code>Object</code> ⏏
create a wallet

**Kind**: Exported function  
**Returns**: <code>Object</code> - wallet  
<a name="exp_module_Aelf/wallet--getWalletByMnemonic"></a>

### getWalletByMnemonic(mnemonic) ⇒ <code>Object</code> ⏏
create a wallet by mnemonic

**Kind**: Exported function  
**Returns**: <code>Object</code> - wallet  

| Param | Type | Description |
| --- | --- | --- |
| mnemonic | <code>string</code> | base on bip39 |

<a name="exp_module_Aelf/wallet--getWalletByPrivateKey"></a>

### getWalletByPrivateKey(privateKey) ⇒ <code>Object</code> ⏏
create a wallet by private key

**Kind**: Exported function  
**Returns**: <code>Object</code> - wallet  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | privateKey |

<a name="exp_module_Aelf/wallet--signTransaction"></a>

### signTransaction(rawTxn, keyPair) ⇒ <code>Object</code> ⏏
sign a transaction

**Kind**: Exported function  
**Returns**: <code>Object</code> - wallet  

| Param | Type | Description |
| --- | --- | --- |
| rawTxn | <code>Object</code> | rawTxn |
| keyPair | <code>Object</code> | keyPair |

<a name="exp_module_Aelf/wallet--sign"></a>

### sign(hexTxn, keyPair) ⇒ <code>Buffer</code> ⏏
just sing

**Kind**: Exported function  
**Returns**: <code>Buffer</code> - Buffer.from(hex, 'hex');  

| Param | Type | Description |
| --- | --- | --- |
| hexTxn | <code>string</code> | hex string |
| keyPair | <code>Object</code> | keyPair |
