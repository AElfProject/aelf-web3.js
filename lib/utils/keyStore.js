/**
 * @file keyStore
 * @author zmh3788
 * @description get AElf key store and unlock AElf key store
*/

var scrypt = require('scrypt.js');
var AES = require('crypto-js/aes');
var SHA3 = require('crypto-js/sha3');
var libWordArray = require('crypto-js/lib-typedarrays');
var encUtf8 = require('crypto-js/enc-utf8');
var encHex = require('crypto-js/enc-hex');

/**
 * get AElf key store
 *
 * @method getKeyStoreFromV1
 * @param {Object} walletInfoInput  walletInfo
 * @param {string} password password
 * @return {Object} keyStore
 *
 */

function getKeyStoreFromV1(walletInfoInput, password) {
    var iv = libWordArray.random(16);
    var salt = libWordArray.random(32);
    var N = 262144;
    var r = 1;
    var p = 8;
    var dkLen = 64;
    var passphrase = Buffer.from(password);
    var saltBuffer = Buffer.from(salt.toString());
    var decryptionKey = scrypt(passphrase, saltBuffer, N, p, r, dkLen);
    var mnemonicEncrypted = AES.encrypt(walletInfoInput.mnemonic, decryptionKey.toString('hex'), {iv: iv});
    var privateKeyEncrypted = AES.encrypt(walletInfoInput.privateKey, decryptionKey.toString('hex'), {iv: iv});
    var mac = SHA3(decryptionKey.slice(16, 32) + mnemonicEncrypted + privateKeyEncrypted, {outputLength: 256});
    return {
        type: 'aelf',
        nickName: walletInfoInput.nickName || '',
        address: walletInfoInput.address || '',
        crypto: {
            version: 1,
            cipher: 'AES256',
            cipherparams: {
                iv: iv.toString()
            },
            mnemonicEncrypted: mnemonicEncrypted.toString(),
            privateKeyEncrypted: privateKeyEncrypted.toString(),
            kdf: 'scrypt',
            kdfparams: {
                r: r,
                N: N,
                p: p,
                dkLen: dkLen,
                salt: salt.toString()
            },
            mac: mac.toString()
        }
    };
}


/**
 * unlock AElf key store
 *
 * @method unlockKeyStoreFromV1
 * @param {Object} keyStoreInput  key store input
 * @param {string} password password
 * @return {Object} walletInfo
 *
 */

function unlockKeyStoreFromV1(keyStoreInput, password) {
    if (keyStoreInput.crypto.version !== 1) {
        throw new Error('Not a V1 key store');
    }
    if (keyStoreInput.type !== 'aelf') {
        throw new Error('Not a aelf key store');
    }
    var iv = keyStoreInput.crypto.cipherparams.iv.toString(encHex);
    var kdfparams = keyStoreInput.crypto.kdfparams;
    var mac = keyStoreInput.crypto.mac;
    var mnemonicEncrypted = keyStoreInput.crypto.mnemonicEncrypted;
    var privateKeyEncrypted = keyStoreInput.crypto.privateKeyEncrypted;
    var passphrase = Buffer.from(password);
    var saltBuffer = Buffer.from(kdfparams.salt.toString());
    var decryptionKey = scrypt(passphrase, saltBuffer, kdfparams.N, kdfparams.p, kdfparams.r, kdfparams.dkLen);
    var currentMac = SHA3(decryptionKey.slice(16, 32) + mnemonicEncrypted + privateKeyEncrypted, {outputLength: 256});
    if (currentMac.toString(encHex) === mac) {
        var mnemonic = AES.decrypt(mnemonicEncrypted, decryptionKey.toString('hex'), {iv: iv});
        var privateKey = AES.decrypt(privateKeyEncrypted, decryptionKey.toString('hex'), {iv: iv});
        return {
            nickName: keyStoreInput.nickName || '',
            address: keyStoreInput.address || '',
            mnemonic: mnemonic.toString(encUtf8),
            privateKey: privateKey.toString(encUtf8)
        };
    }
    return {
        error: 20001,
        errorMessage: 'Password error'
    };
}

function checkPassword(walletInfoInput, password) {
    var mac = walletInfoInput.crypto.mac;
    var mnemonicEncrypted = walletInfoInput.crypto.mnemonicEncrypted;
    var privateKeyEncrypted = walletInfoInput.crypto.privateKeyEncrypted;
    var kdfparams = walletInfoInput.crypto.kdfparams;
    var passphrase = Buffer.from(password);
    var saltBuffer = Buffer.from(kdfparams.salt.toString());
    var decryptionKey = scrypt(passphrase, saltBuffer, kdfparams.N, kdfparams.p, kdfparams.r, kdfparams.dkLen);
    var currentMac = SHA3(decryptionKey.slice(16, 32) + mnemonicEncrypted + privateKeyEncrypted, {outputLength: 256});
    if (currentMac.toString(encHex) === mac) {
        return true;
    }
    return false;
}


module.exports = {
    getKeyStoreFromV1: getKeyStoreFromV1,
    unlockKeyStoreFromV1: unlockKeyStoreFromV1,
    checkPassword: checkPassword
};
