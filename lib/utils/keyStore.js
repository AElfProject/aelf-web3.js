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
 * getKeystore
 *
 * @method getKeystore
 * @param {Object} walletInfoInput  walletInfo
 * @param {string} password password
 * @param {number} version version
 * @return {Object} keyStore
 *
 */

function getKeystore(walletInfoInput, password, version) {
    var keystore = null;
    var versions = version || 1;
    switch (versions) {
        case 1 :
            keystore = getKeyStoreFromV1(walletInfoInput, password);
            break;
        default:
            throw new Error('The version is incorrect');
    }
    return keystore;
}


/**
 * unlockKeystore
 *
 * @method unlockKeystore
 * @param {Object} keyStoreInput  walletInfo
 * @param {string} password password
 * @param {number} version version
 * @return {Object} walletInfo
 *
 */

function unlockKeystore(keyStoreInput, password, version) {
    var walletInfo = null;
    var versions = version || 1;
    switch (versions) {
        case 1 :
            walletInfo = unlockKeyStoreFromV1(keyStoreInput, password);
            break;
        default:
            throw new Error('The version is incorrect');
    }
    return walletInfo;
}


/**
 * getKeyStoreFromV1
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
    else {
        throw new Error('Password error');
    }
}

/**
 * checkPassword
 *
 * @method checkPassword
 * @param {Object} keyStoreInput  keyStoreInput
 * @param {string} password password
 * @return {Boolean} true or false
 *
 */

function checkPassword(keyStoreInput, password) {
    if (keyStoreInput.type !== 'aelf') {
        throw new Error('Not a aelf key store');
    }
    var mac = keyStoreInput.crypto.mac;
    var mnemonicEncrypted = keyStoreInput.crypto.mnemonicEncrypted;
    var privateKeyEncrypted = keyStoreInput.crypto.privateKeyEncrypted;
    var kdfparams = keyStoreInput.crypto.kdfparams;
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
    getKeystore: getKeystore,
    unlockKeystore: unlockKeystore,
    checkPassword: checkPassword
};
