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
if(createHmac === undefined){
    // Used in CLI
    createHmac = global.crypto.createHmac;
}

var AES = require("crypto-js/aes");
var encUtf8 = require("crypto-js/enc-utf8");

// Advanced Encryption Standard need crypto-js
function AESEncrypto (input, password) {
    var ciphertext = AES.encrypt(input, password);
    // no encUtf8 here.
    return ciphertext.toString();
}

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
    }
}

// 和C#保持同步
var getAddressFromPubKey = function (pubKey) {
    var pubKeyEncoded = pubKey.encode();
    var hash = sha256(sha256.arrayBuffer(pubKeyEncoded)).slice(0, 60);
    return utils.encodeAddressRep(hash);
};

var createNewWallet = function () {
    return _getWallet('createNewWallet', '');
};

var getWalletByMnemonic = function (mnemonic) {
    if (bip39.validateMnemonic(mnemonic)) {
        return _getWallet('getWalletByMnemonic', mnemonic);
    }
    return false;
};

var getWalletByPrivateKey = function (privateKey) {
    if (privateKey.length == 64) {
        return _getWallet('getWalletByPrivateKey', privateKey);
    }
    return false;
};

var signTransaction = function(rawTxn, keyPair){
    var privKey = keyPair.getPrivate("hex");
    var pubKey = keyPair.getPublic();

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
    var hex = sigObj.r.toString('hex', 32).concat(sigObj.s.toString('hex', 32)).concat(['0' + sigObj.recoveryParam.toString()]);
    var sig = Buffer.from(hex, 'hex');
    rawTxn.Sigs.push(sig);

    return rawTxn;
};

var sign = function (hexTxn, keyPair) {
    var txnData = Buffer.from(hexTxn.replace('0x', ''), 'hex');
    var privKey = keyPair.getPrivate("hex");
    var msgHash = sha256(txnData);
    var sigObj = ec.sign(Buffer.from(msgHash, "hex"), privKey, "hex", {canonical: true});
    var hex = sigObj.r.toString('hex', 32).concat(sigObj.s.toString('hex', 32)).concat(['0' + sigObj.recoveryParam.toString()]);
    var sig = Buffer.from(hex, 'hex');
    return sig;
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
