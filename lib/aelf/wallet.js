/**
 * @file aelf.js - AELF JavaScript API
 * @author gl,hzz780
 *
*/
/**
 * wallet module.
 * @module AElf/wallet
 */
const sha256 = require('js-sha256').sha256;
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');
const proto = require('./proto.js');
const utils = require('../utils/utils');
const keyStore = require('../utils/keyStore');

const bip39 = require('bip39');
const hdkey = require('hdkey');

const AES = require('crypto-js/aes');
const encUtf8 = require('crypto-js/enc-utf8');

/**
 * Advanced Encryption Standard need crypto-js
 *
 * @alias module:AElf/wallet
 * @param {string} input anything you want to encrypt
 * @param {string} password password
 * @return {string} crypted input
 *
 * @Example
 * const AESEncryptPrivateKey = aelf.wallet.AESEncrypt('123', '123');
 * // AESEncryptPrivateKey = "U2FsdGVkX1+RYovrVJVEEl8eiIUA3vx4GrNR+3sqOow="
 * const AESEncryptMnemonic = alef.wallet.AESEncrypt('hello world', '123');
 * // AESEncryptMnemonic = U2FsdGVkX19gCjHzYmoY5FGZA1ArXG+eGZIR77dK2GE=
 *
 */
const AESEncrypt = function (input, password) {
    const ciphertext = AES.encrypt(input, password);
    // no encUtf8 here.
    return ciphertext.toString();
};

/**
 * Decrypt any encrypted information you want to decrypt
 *
 * @alias module:AElf/wallet
 * @param {string} input anything you want to decrypt
 * @param {string} password password
 * @return {string} decrypted input
 *
 * @Example
 * const AESDecryptPrivateKey = aelf.wallet.AESDecrypt('U2FsdGVkX18+tvF7t4rhGOi5cbUvdTH2U5a6Tbu4Ojg=', '123');
 * // AESDecryptPrivateKey = "123"
 * const AESDecryptMnemonic = aelf.wallet.AESDecrypt('U2FsdGVkX19gCjHzYmoY5FGZA1ArXG+eGZIR77dK2GE=', '123');
 * // AESDecryptMnemonic = "hello world"
 */
const AESDecrypt = function (input, password) {
    const bytes  = AES.decrypt(input, password);
    return bytes.toString(encUtf8);
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
const getAddressFromPubKey = function (pubKey) {
    const pubKeyEncoded = pubKey.encode();
    const hash = sha256(Buffer.from(sha256(pubKeyEncoded), 'hex')).slice(0, 64);
    return utils.encodeAddressRep(hash);
};

function _getWallet(type, value, BIP44Path = null) {
    // m/purpose'/coin_type'/account'/change/address_index
    // "m/44'/1616'/0'/0/0"
    BIP44Path = BIP44Path || 'm/44\'/1616\'/0\'/0/0';

    let mnemonic = '';
    let rootSeed = '';
    let childWallet = '';
    let keyPair = '';
    let hdWallet;
    switch (type) {
        case 'createNewWallet':
            mnemonic = bip39.generateMnemonic();
            rootSeed = bip39.mnemonicToSeedHex(mnemonic);
            hdWallet = hdkey.fromMasterSeed(rootSeed);
            childWallet = hdWallet.derive(BIP44Path);
            keyPair = ec.keyFromPrivate(childWallet.privateKey);
            break;
        case 'getWalletByMnemonic':
            mnemonic = value;
            rootSeed = bip39.mnemonicToSeedHex(mnemonic);
            hdWallet = hdkey.fromMasterSeed(rootSeed);
            childWallet = hdWallet.derive(BIP44Path);
            keyPair = ec.keyFromPrivate(childWallet.privateKey);
            break;
        case 'getWalletByPrivateKey':
            keyPair = ec.keyFromPrivate(value);
            break;
    }
    // let mnemonic = bip39.generateMnemonic();
    // let rootSeed = bip39.mnemonicToSeedHex(mnemonic);
    // let hdWallet = hdkey.fromMasterSeed(rootSeed);
    // let keyPair = ec.keyFromPrivate(xPrivateKey);
    // TODO 1.将私钥加密保存,用密码解密才能使用。
    // TODO 2.将助记词机密保存,用密码解密才能获取。
    const privateKey = keyPair.getPrivate('hex');
    const publicKey = keyPair.getPublic();
    const address = getAddressFromPubKey(publicKey);
    return {
        mnemonic,
        BIP44Path,
        childWallet,
        keyPair,
        privateKey,
        address
    };
}

function getSignature(bytesToBeSign, keyPair) {
    const privKey = keyPair.getPrivate('hex');
    const msgHash = sha256(bytesToBeSign);
    const sigObj = ec.sign(Buffer.from(msgHash, 'hex'), privKey, 'hex', {
        canonical: true
    });
    const hex = [
        sigObj.r.toString('hex', 32),
        sigObj.s.toString('hex', 32),
        '0' + sigObj.recoveryParam.toString()
    ].join('');
    const signature = Buffer.from(hex, 'hex');
    return signature;
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
 * //     mnemonic: "hello world",
 * //     BIP44Path: 'm/44\'/1616\'/0\'/0/0',
 * //     childWallet: {},
 * //     keyPair: KeyPair {ec: EC, priv: BN, pub: Point}
 * //     privateKey: "123f7c123"
 * //     address: "5uhk3434242424"
 * // }
 */
const createNewWallet = function (BIP44Path) {
    return _getWallet('createNewWallet', '', BIP44Path);
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
 * const mnemonicWallet = aelf.wallet.getWalletByMnemonic('hello world');
 */
const getWalletByMnemonic = function (mnemonic, BIP44Path) {
    if (bip39.validateMnemonic(mnemonic)) {
        return _getWallet('getWalletByMnemonic', mnemonic, BIP44Path);
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
const getWalletByPrivateKey = function (privateKey) {
    if (privateKey.length === 64) {
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
const signTransaction = function (rawTxn, keyPair) {
    if (rawTxn.params.length === 0) {
        rawTxn.params = null;
    }
    // proto in proto.Transaction use proto2, but C# use proto3
    // proto3 will remove the default value key.
    // The differences between proto2 and proto3:
    // https://blog.csdn.net/huanggang982/article/details/77944174
    const ser = proto.Transaction.encode(rawTxn).finish();
    const sig = getSignature(ser, keyPair);
    rawTxn.signature = sig;
    return rawTxn;
};

/**
 * Encryption Using Elliptic Curve Algorithms（Use ECDSA)
 * Please see https://www.npmjs.com/package/elliptic#incentive
 *
 * @alias module:AElf/wallet
 * @param {string} hexString hex string
 * @param {Object} keyPair Any standard key pair
 * @return {Buffer} Buffer.from(hex, 'hex')
 *
 * @Example
 * const buffer = aelf.wallet.sign('68656c6c6f20776f726c64', wallet.keyPair);
 * // buffer = [65, 246, 49, 108, 122, 252, 66, 187, 240, 7, 14, 48, 89, 38, 103, 42, 58, 0, 46, 182, 180, 194, 200, 208, 141, 15, 95, 67, 234, 248, 31, 199, 73, 151, 2, 133, 233, 84, 180, 216, 116, 9, 153, 208, 254, 175, 96, 123, 76, 184, 224, 87, 69, 220, 172, 170, 239, 232, 188, 123, 168, 163, 244, 151, 1]
 */
const sign = function (hexString, keyPair) {
    const bytesToBeSign = Buffer.from(hexString.replace('0x', ''), 'hex');
    const signature = getSignature(bytesToBeSign, keyPair);
    return signature;
};

module.exports = {
    bip39,
    hdkey,
    signTransaction,
    sign,
    createNewWallet,
    getWalletByMnemonic,
    getWalletByPrivateKey,
    AESEncrypt,
    AESDecrypt,
    keyStore
};
