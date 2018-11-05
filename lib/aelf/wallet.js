/*!
 * aelf.js - AELF JavaScript API
 *
 * @license lgpl-3.0
 * @see https://github.com/aelf/aelf.js
*/
var sha256 = require('js-sha256').sha256;
var elliptic = require('elliptic');
var proto = require('./proto.js');
var ec = new elliptic.ec('secp256k1');
var utils = require('../utils/utils');

var bip39 = require('bip39');
var createHmac = require('crypto').createHmac;

var AES = require("crypto-js/aes");
var encUtf8 = require("crypto-js/enc-utf8");

// Advanced Encryption Standard need crypto-js
function AESEncrypto (input, password) {
    let ciphertext = AES.encrypt(input, password);
    // no encUtf8 here.
    return ciphertext.toString();
}

function AESDecrypto(input, password) {
    let bytes  = AES.decrypt(input, password);
    return bytes.toString(encUtf8);
}

function _getHDWalletMasterPrivateKey (rootSeedHex) {
    if (rootSeedHex.length == 128) {
        let hash = createHmac('sha512', rootSeedHex).update('ELF to da moon').digest('hex');
        return hash.slice(0, 64);
    } else {
        return false;
    }
}

function _getWallet(type, value) {
    let mnemonic = '';
    let rootSeed = '';
    let xPrivateKey = '';
    let keyPair = '';
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
    let privateKey = keyPair.getPrivate("hex");
    let publicKey = keyPair.getPublic();
    let address = getAddressFromPubKey(publicKey);
    return {
        keyPair: keyPair,
        mnemonic: mnemonic,
        xPrivateKey: xPrivateKey || privateKey,
        privateKey: privateKey,
        address: address
    }
}

// 和C#保持同步
let getAddressFromPubKey = function (pubKey) {
    let pubKeyEncoded = pubKey.encode();
    let length = pubKeyEncoded.length;
    pubKeyEncoded = pubKeyEncoded.slice(length - 18, length);

    let address = utils.uint8ArrayToHex(pubKeyEncoded);
    // address = '0x' + address; // aelf chain remove 0x in 2018.10
    return address;
};

let createNewWallet = function () {
    return _getWallet('createNewWallet', '');
};

let getWalletByMnemonic = function (mnemonic) {
    if (bip39.validateMnemonic(mnemonic)) {
        return _getWallet('getWalletByMnemonic', mnemonic);
    }
    return false;
};

let getWalletByPrivateKey = function (privateKey) {
    if (privateKey.length == 64) {
        return _getWallet('getWalletByPrivateKey', privateKey);
    }
    return false;
};

var signTransaction = function(rawTxn, keyPair){
    let privKey = keyPair.getPrivate("hex");
    let pubKey = keyPair.getPublic();

    rawTxn.R = null;
    rawTxn.S = null;
    rawTxn.P = null;
    if(rawTxn.Params.length == 0){
        rawTxn.Params = null;
    }
    // proto in proto.Transaction use proto2, but C# use proto3
    // proto3 will remove the default value key.
    // The differences between proto2 and proto3:
    // https://blog.csdn.net/huanggang982/article/details/77944174
    if(rawTxn.IncrementId == 0){
        rawTxn.IncrementId = null;
    }

    var ser = proto.Transaction.encode(rawTxn).finish();
    var msgHash = sha256(ser);

    var sigObj = ec.sign(Buffer.from(msgHash, "hex"), privKey, "hex", {canonical: true});

    // 可能是我使用BN的方式有问题，toBuffer在浏览器端有点问题。
    // toBuffer 是封装的toArrayLike
    rawTxn.R = sigObj.r.toArrayLike(Buffer);
    rawTxn.S = sigObj.s.toArrayLike(Buffer);
    rawTxn.P = new Buffer(pubKey.encode());

    return rawTxn;
}

module.exports = {
    bip39: bip39,
    signTransaction: signTransaction,
    createNewWallet: createNewWallet,
    getWalletByMnemonic: getWalletByMnemonic,
    getWalletByPrivateKey: getWalletByPrivateKey,
    AESEncrypto: AESEncrypto,
    AESDecrypto: AESDecrypto
};