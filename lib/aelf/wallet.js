/**
 * @file aelf.js - AELF JavaScript API
 * @author gl,hzz780
 * @license lgpl-3.0
 * @see https://github.com/aelf/aelf.js
*/
/**
 * wallet module.
 * @module Aelf/wallet
 */
var sha256 = require('js-sha256').sha256;
var elliptic = require('elliptic');
var proto = require('./proto.js');
var ec = new elliptic.ec('secp256k1');
var utils = require('../utils/utils');

var bip39 = require('bip39');
var createHmac = require('crypto').createHmac;
if (createHmac === undefined) {
    // Used in CLI
    createHmac = global.crypto.createHmac;
}

var AES = require("crypto-js/aes");
var encUtf8 = require("crypto-js/enc-utf8");

/**
 * Advanced Encryption Standard need crypto-js
 *
 * @alias module:Aelf/wallet
 * @param {string} input anything you want to encrypt
 * @param {string} password password
 * @return {string} crypted input
 *
 * @Example
 * const AESEncryptoPrivateKey = aelf.wallet.AESEncrypto('123', '123');
 * const AESEncryptoMnemonic = alef.wallet.AESEncrypto('hello world', '123');
 *
 */
function AESEncrypto (input, password) {
    var ciphertext = AES.encrypt(input, password);
    // no encUtf8 here.
    return ciphertext.toString();
}

/**
 * Decrypt any encrypted information you want to decrypt
 *
 * @alias module:Aelf/wallet
 * @param {string} input anything you want to decrypt
 * @param {string} password password
 * @return {string} decrypted input
 *
 * @Example
 * const AESDecryptoPrivateKey = aelf.wallet.AESDecrypto('U2FsdGVkX18+tvF7t4rhGOi5cbUvdTH2U5a6Tbu4Ojg=', '123');
 * const AESDecryptoMnemonic = aelf.wallet.AESDecrypto('U2FsdGVkX19gCjHzYmoY5FGZA1ArXG+eGZIR77dK2GE=', '123');
 */
function AESDecrypto(input, password) {
    var bytes  = AES.decrypt(input, password);
    return bytes.toString(encUtf8);
}

function _getHDWalletMasterPrivateKey (rootSeedHex) {
    if (rootSeedHex.length == 128) {
        // var hash = createHmac('sha512', rootSeedHex).update('ELF to da moon').digest('hex');
        var hmac = createHmac('sha512', rootSeedHex);
        var hash = hmac.update('ELF to da moon').digest('hex');
        return hash.slice(0, 64);
    } else {
        return false;
    }
}

function _getWallet(type, value) {
    var mnemonic = '';
    var rootSeed = '';
    var xPrivateKey = '';
    var keyPair = '';
    switch (type) {
        case 'createNewWallet':
            mnemonic = bip39.generateMnemonic();
            rootSeed = bip39.mnemonicToSeedHex(mnemonic);
            xPrivateKey = _getHDWalletMasterPrivateKey(rootSeed);
            keyPair = ec.keyFromPrivate(xPrivateKey);
            break;
        case 'getWalletByMnemonic':
            mnemonic = value;
            rootSeed = bip39.mnemonicToSeedHex(mnemonic);
            xPrivateKey = _getHDWalletMasterPrivateKey(rootSeed);
            keyPair = ec.keyFromPrivate(xPrivateKey);
            break;
        case 'getWalletByPrivateKey':
            keyPair = ec.keyFromPrivate(value);
            break;
    }
    // let mnemonic = bip39.generateMnemonic();
    // let rootSeed = bip39.mnemonicToSeedHex(mnemonic);
    // let xPrivateKey = getHDWalletMasterPrivateKey(rootSeed);
    // let keyPair = ec.keyFromPrivate(xPrivateKey);
    // TODO 1.将私钥加密保存,用密码解密才能使用。
    // TODO 2.将助记词机密保存,用密码解密才能获取。
    var privateKey = keyPair.getPrivate("hex");
    var publicKey = keyPair.getPublic();
    var address = getAddressFromPubKey(publicKey);
    return {
        keyPair: keyPair,
        mnemonic: mnemonic,
        xPrivateKey: xPrivateKey || privateKey,
        privateKey: privateKey,
        address: address
    };
}

/**
 * the same as in C#
 *
 * @alias module:Aelf/wallet
 * @param {Object} pubKey get the pubKey you want through keyPair
 * @return {string} address encoded address
 *
 * @Example
 * const keyPair = a: {
 *     ec: c {curve: c, n: a, nh: a, g: u, hash: ƒ}
 *     priv: a {negative: 0, words: Array(11), length: 10, red: null}
 *     pub: u {curve: c, type: "affine", precomputed: null, x: a, y: a, …}
 *  }
 * const pubKey = keyPair.getPublic();
 * const address = aelf.wallet.getAddressFromPubKey(pubKey);
 */
var getAddressFromPubKey = function (pubKey) {
    var pubKeyEncoded = pubKey.encode();
    var hash = sha256(sha256.arrayBuffer(pubKeyEncoded)).slice(0, 60);
    return utils.encodeAddressRep(hash);
};

/**
 * create a wallet
 *
 * @alias module:Aelf/wallet
 * @return {Object} wallet
 *
 * @Example
 * const wallet = aelf.wallet.createNewWallet();
 */
var createNewWallet = function () {
    return _getWallet('createNewWallet', '');
};

/**
 * create a wallet by mnemonic
 *
 * @alias module:Aelf/wallet
 * @param {string} mnemonic base on bip39
 * @return {Object} wallet
 *
 * @Example
 * 
 * const mnemonicWallet = aelf.wallet.getWalletByMnemonic('hallo world');
 */
var getWalletByMnemonic = function (mnemonic) {
    if (bip39.validateMnemonic(mnemonic)) {
        return _getWallet('getWalletByMnemonic', mnemonic);
    }
    return false;
};

/**
 * create a wallet by private key
 *
 * @alias module:Aelf/wallet
 * @param {string} privateKey privateKey
 * @return {Object} wallet
 *
 * @Example
 * const privateKeyWallet = aelf.wallet.getWalletByPrivateKey('123');
 *
 */
var getWalletByPrivateKey = function (privateKey) {
    if (privateKey.length == 64) {
        return _getWallet('getWalletByPrivateKey', privateKey);
    }
    return false;
};

/**
 * sign a transaction
 *
 * @alias module:Aelf/wallet
 * @param {Object} rawTxn rawTxn
 * @param {Object} keyPair Any standard key pair
 * @return {Object} wallet
 *
 * @Example
 * const keyPair = a: {
 *     ec: c {curve: c, n: a, nh: a, g: u, hash: ƒ}
 *     priv: a {negative: 0, words: Array(11), length: 10, red: null}
 *     pub: u {curve: c, type: "affine", precomputed: null, x: a, y: a, …}
 *  }
 * const rawTxn = proto.getTransaction('ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9', 'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9', 'test', []);
 * const wallet = aelf.wallet.signTransaction(rawTxn, keyPair);
 */
var signTransaction = function (rawTxn, keyPair) {
    var privKey = keyPair.getPrivate('hex');
    var pubKey = keyPair.getPublic();

    rawTxn.R = null;
    rawTxn.S = null;
    rawTxn.P = null;
    if (rawTxn.Params.length == 0) {
        rawTxn.Params = null;
    }
    // proto in proto.Transaction use proto2, but C# use proto3
    // proto3 will remove the default value key.
    // The differences between proto2 and proto3:
    // https://blog.csdn.net/huanggang982/article/details/77944174
    if (rawTxn.IncrementId == 0) {
        rawTxn.IncrementId = null;
    }

    if (rawTxn.Fee == 0) {
        rawTxn.Fee = null;
    }

    var ser = proto.Transaction.encode(rawTxn).finish();
    var msgHash = sha256(ser);

    var sigObj = ec.sign(Buffer.from(msgHash, "hex"), privKey, "hex", {canonical: true});
    var hex = sigObj.r.toString('hex', 32).concat(sigObj.s.toString('hex', 32)).concat(['0' + sigObj.recoveryParam.toString()]);
    var sig = Buffer.from(hex, 'hex');
    rawTxn.Sigs.push(sig);

    return rawTxn;
};

/**
 * just sign
 *
 * @alias module:Aelf/wallet
 * @param {string} hexTxn hex string
 * @param {Object} keyPair Any standard key pair
 * @return {Buffer} Buffer.from(hex, 'hex')
 *
 * @Example
 *  const keyPair = a: {
 *     ec: c {curve: c, n: a, nh: a, g: u, hash: ƒ}
 *     priv: a {negative: 0, words: Array(11), length: 10, red: null}
 *     pub: u {curve: c, type: "affine", precomputed: null, x: a, y: a, …}
 *  }
 * aelf.wallet.sign('68656c6c6f20776f726c64', keyPair);
 */
var sign = function (hexTxn, keyPair) {
    var txnData = Buffer.from(hexTxn.replace('0x', ''), 'hex');
    var privKey = keyPair.getPrivate("hex");
    var msgHash = sha256(txnData);
    var sigObj = ec.sign(Buffer.from(msgHash, "hex"), privKey, "hex", {canonical: true});
    var hex = sigObj.r.toString('hex', 32).concat(sigObj.s.toString('hex', 32)).concat(['0' + sigObj.recoveryParam.toString()]);
    return Buffer.from(hex, 'hex');
};

module.exports = {
    bip39: bip39,
    signTransaction: signTransaction,
    sign: sign,
    createNewWallet: createNewWallet,
    getWalletByMnemonic: getWalletByMnemonic,
    getWalletByPrivateKey: getWalletByPrivateKey,
    AESEncrypto: AESEncrypto,
    AESDecrypto: AESDecrypto
};
