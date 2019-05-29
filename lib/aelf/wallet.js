/**
 * @file aelf.js - AELF JavaScript API
 * @author gl,hzz780
 * @license lgpl-3.0
 * @see https://github.com/aelf/aelf.js
*/
/**
 * wallet module.
 * @module AElf/wallet
 */
var sha256 = require('js-sha256').sha256;
var elliptic = require('elliptic');
var proto = require('./proto.js');
var ec = new elliptic.ec('secp256k1');
var utils = require('../utils/utils');
var keyStore = require('../utils/keyStore');

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
 * @alias module:AElf/wallet
 * @param {string} input anything you want to encrypt
 * @param {string} password password
 * @return {string} crypted input
 *
 * @Example
 * const AESEncryptoPrivateKey = aelf.wallet.AESEncrypto('123', '123');
 * // AESEncryptoPrivateKey = "U2FsdGVkX1+RYovrVJVEEl8eiIUA3vx4GrNR+3sqOow="
 * const AESEncryptoMnemonic = alef.wallet.AESEncrypto('hello world', '123');
 * // AESEncryptoMnemonic = U2FsdGVkX19gCjHzYmoY5FGZA1ArXG+eGZIR77dK2GE=
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
 * @alias module:AElf/wallet
 * @param {string} input anything you want to decrypt
 * @param {string} password password
 * @return {string} decrypted input
 *
 * @Example
 * const AESDecryptoPrivateKey = aelf.wallet.AESDecrypto('U2FsdGVkX18+tvF7t4rhGOi5cbUvdTH2U5a6Tbu4Ojg=', '123');
 * // AESDecryptoPrivateKey = "123"
 * const AESDecryptoMnemonic = aelf.wallet.AESDecrypto('U2FsdGVkX19gCjHzYmoY5FGZA1ArXG+eGZIR77dK2GE=', '123');
 * // AESDecryptoMnemonic = "hello world"
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
 * create a wallet
 *
 * @alias module:AElf/wallet
 * @return {Object} wallet
 *
 * @Example
 * const wallet = aelf.wallet.createNewWallet();
 * // The format returned is similar to this
 * // wallet = {
 * //     address: "5uhk3434242424"
 * //     keyPair: KeyPair {ec: EC, priv: BN, pub: Point}
 * //     mnemonic: "hello world"
 * //     privateKey: "123f7c123"
 * //     xPrivateKey: "475f7c475"
 * // }
 */
var createNewWallet = function () {
    return _getWallet('createNewWallet', '');
};


/**
 * the same as in C#
 *
 * @alias module:AElf/wallet
 * @param {Object} pubKey get the pubKey you want through keyPair
 * @return {string} address encoded address
 *
 * @Example
 * const pubKey = wallet.keyPair.getPublic();
 * const address = aelf.wallet.getAddressFromPubKey(pubKey);
 */
var getAddressFromPubKey = function (pubKey) {
    var pubKeyEncoded = pubKey.encode();
    var hash = sha256(sha256.arrayBuffer(pubKeyEncoded)).slice(0, 64);
    return utils.encodeAddressRep(hash);
};

/**
 * create a wallet by mnemonic
 *
 * @alias module:AElf/wallet
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
 * @alias module:AElf/wallet
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
 * @alias module:AElf/wallet
 * @param {Object} rawTxn rawTxn
 * @param {Object} keyPair Any standard key pair
 * @return {Object} wallet
 *
 * @Example
 * const rawTxn = proto.getTransaction('ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9', 'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9', 'test', []);
 * const signWallet = aelf.wallet.signTransaction(rawTxn, wallet.keyPair);
 * // signWallet = {
 * //     Transaction: {
 * //    Sigs:
 * //     [ <Buffer af 61 1a fa 9c 94 8f 23 e7 f5 b5 03 dc ca 62 b1 94 05 e9 cc 28 ed 9b 6c af 1f 4f 1b 78 14 5e 52 72 35 81 ba b1 51 35 4c 63 c5 38 0a 1f b9 b9 ab d8 22 ... > ],
 * //     From:
 * //     Address {
 * //         Value: <Buffer e0 b4 0d dc 35 20 d0 b5 36 3b d9 77 50 14 d7 7e 4b 8f e8 32 94 6d 0e 38 25 73 1d 89 12 7b>
 * //     },
 * //     To:
 * //         Address {
 * //            Value: <Buffer e0 b4 0d dc 35 20 d0 b5 36 3b d9 77 50 14 d7 7e 4b 8f e8 32 94 6d 0e 38 25 73 1d 89 12 7b>
 * //         },
 * //         MethodName: 'test',
 * //         Params: null
 * //     }
 * //  }
 */
var signTransaction = function (rawTxn, keyPair) {
    var privKey = keyPair.getPrivate('hex');

    if (rawTxn.Params.length == 0) {
        rawTxn.Params = null;
    }
    // proto in proto.Transaction use proto2, but C# use proto3
    // proto3 will remove the default value key.
    // The differences between proto2 and proto3:
    // https://blog.csdn.net/huanggang982/article/details/77944174

    var ser = proto.Transaction.encode(rawTxn).finish();
    var msgHash = sha256(ser);

    var sigObj = ec.sign(Buffer.from(msgHash, 'hex'), privKey, 'hex', {canonical: true});
    var hex = sigObj.r.toString('hex', 32).concat(sigObj.s.toString('hex', 32)).concat(['0' + sigObj.recoveryParam.toString()]);
    var sig = Buffer.from(hex, 'hex');
    rawTxn.Signature = sig;

    return rawTxn;
};

/**
 * just sign
 *
 * @alias module:AElf/wallet
 * @param {string} hexTxn hex string
 * @param {Object} keyPair Any standard key pair
 * @return {Buffer} Buffer.from(hex, 'hex')
 *
 * @Example
 * const buffer = aelf.wallet.sign('68656c6c6f20776f726c64', wallet.keyPair);
 * // buffer = [65, 246, 49, 108, 122, 252, 66, 187, 240, 7, 14, 48, 89, 38, 103, 42, 58, 0, 46, 182, 180, 194, 200, 208, 141, 15, 95, 67, 234, 248, 31, 199, 73, 151, 2, 133, 233, 84, 180, 216, 116, 9, 153, 208, 254, 175, 96, 123, 76, 184, 224, 87, 69, 220, 172, 170, 239, 232, 188, 123, 168, 163, 244, 151, 1]
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
    AESDecrypto: AESDecrypto,
    keyStore: keyStore
};
