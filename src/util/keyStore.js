/**
 * @file AElf keyStore tools
 * @author atom-yang
 */
import scrypt from 'scrypt.js/js';
import AES from 'crypto-js/aes';
import SHA3 from 'crypto-js/sha3';
import libWordArray from 'crypto-js/lib-typedarrays';
import encUtf8 from 'crypto-js/enc-utf8';
import encHex from 'crypto-js/enc-hex';
import { noop } from './utils';
import { KEY_STORE_ERRORS } from '../common/constants';

/**
 * getKeyStoreFromV1
 *
 * @method getKeyStoreFromV1
 * @param {Object} walletInfoInput  walletInfo
 * @param {string} password password
 * @return {Object} keyStore
 */
function getKeyStoreFromV1(
  {
    mnemonic,
    privateKey,
    nickName = '',
    address = ''
  },
  password
) {
  const iv = libWordArray.random(16);
  const salt = libWordArray.random(32);
  const SAFE_ITERATION_COUNT = 262144;
  const BLOCK_SIZE = 1;
  const PARALLEL_FACTOR = 8;
  const dkLen = 64;
  const passphrase = Buffer.from(password);
  const saltBuffer = Buffer.from(salt.toString());
  const decryptionKey = scrypt(
    passphrase,
    saltBuffer,
    SAFE_ITERATION_COUNT,
    BLOCK_SIZE,
    PARALLEL_FACTOR,
    dkLen
  );
  const mnemonicEncrypted = AES.encrypt(mnemonic, decryptionKey.toString('hex'), { iv });
  const privateKeyEncrypted = AES.encrypt(privateKey, decryptionKey.toString('hex'), { iv });
  const mac = SHA3(decryptionKey.slice(16, 32) + mnemonicEncrypted + privateKeyEncrypted, { outputLength: 256 });
  const result = {
    type: 'aelf',
    nickName,
    address,
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
        r: BLOCK_SIZE,
        N: SAFE_ITERATION_COUNT,
        p: PARALLEL_FACTOR,
        dkLen,
        salt
      },
      mac: mac.toString()
    }
  };

  return {
    error: null,
    result
  };
}


/**
 * unlock AElf key store
 *
 * @method unlockKeyStoreFromV1
 * @param {Object} keyStoreInput  key store input
 * @param {string} password password
 * @return {Object} walletInfo
 */
function unlockKeyStoreFromV1(
  {
    crypto,
    type,
    nickName = '',
    address = ''
  },
  password
) {
  let error = null;
  let result = null;
  const {
    kdfparams,
    mac,
    cipherparams,
    version,
    mnemonicEncrypted,
    privateKeyEncrypted
  } = crypto;
  if (version !== 1) {
    error = { ...KEY_STORE_ERRORS.WRONG_KEY_STORE_VERSION };
  }
  if (type !== 'aelf') {
    error = { ...KEY_STORE_ERRORS.NOT_AELF_KEY_STORE };
  }
  const iv = cipherparams.iv.toString(encHex);
  const passphrase = Buffer.from(password);
  const saltBuffer = Buffer.from(kdfparams.salt.toString());
  const decryptionKey = scrypt(passphrase, saltBuffer, kdfparams.N, kdfparams.p, kdfparams.r, kdfparams.dkLen);
  const currentMac = SHA3(decryptionKey.slice(16, 32) + mnemonicEncrypted + privateKeyEncrypted, { outputLength: 256 });
  if (currentMac.toString(encHex) === mac) {
    const mnemonic = AES.decrypt(mnemonicEncrypted, decryptionKey.toString('hex'), { iv });
    const privateKey = AES.decrypt(privateKeyEncrypted, decryptionKey.toString('hex'), { iv });
    result = {
      nickName,
      address,
      mnemonic: mnemonic.toString(encUtf8),
      privateKey: privateKey.toString(encUtf8)
    };
  } else {
    error = { ...KEY_STORE_ERRORS.WRONG_VERSION };
  }

  return {
    error,
    result
  };
}

/**
 * getKeystore
 *
 * @method getKeystore
 * @param {Object} walletInfoInput  walletInfo
 * @param {string} password password
 * @param {number} version version
 * @param {Function} callback callback
 * @return {Promise}
 */
export const getKeystore = (walletInfoInput, password, version, callback = noop) => {
  let keystore = null;
  const versions = version || 1;
  let error = null;
  if (+versions === 1) {
    keystore = getKeyStoreFromV1(walletInfoInput, password);
  } else {
    error = { ...KEY_STORE_ERRORS.WRONG_VERSION };
  }
  return new Promise((resolve, reject) => {
    callback(error || keystore.error, keystore.result);
    if (error || keystore.error) {
      reject(error || keystore.error);
    } else {
      resolve(keystore.result);
    }
  });
};


/**
 * unlock keyStore
 * @method unlockKeystore
 * @param {Object} keyStoreInput  walletInfo
 * @param {string} password password
 * @param {number} version version
 * @param {Function} callback
 * @returns {Promise}
 */
export const unlockKeystore = (keyStoreInput, password, version, callback = noop) => {
  let walletInfo = null;
  const versions = version || 1;
  let error = null;
  if (versions === 1) {
    walletInfo = unlockKeyStoreFromV1(keyStoreInput, password);
  } else {
    error = { ...KEY_STORE_ERRORS.WRONG_VERSION };
  }

  return new Promise((resolve, reject) => {
    callback(error || walletInfo.error, walletInfo.result);
    if (error || walletInfo.error) {
      reject(error || walletInfo.error);
    } else {
      resolve(walletInfo.result);
    }
  });
};

/**
 * checkPassword
 *
 * @method checkPassword
 * @param {Object} keyStoreInput  keyStoreInput
 * @param {string} password password
 * @param {Function} callback
 * @return {Promise} true or false
 */
export const checkPassword = (
  { crypto, type },
  password,
  callback = noop
) => {
  let error = null;
  let result = false;
  if (type !== 'aelf') {
    error = { ...KEY_STORE_ERRORS.NOT_AELF_KEY_STORE };
  } else {
    const {
      mac,
      mnemonicEncrypted,
      privateKeyEncrypted,
      kdfparams
    } = crypto;
    const passphrase = Buffer.from(password);
    const saltBuffer = Buffer.from(kdfparams.salt.toString());
    const decryptionKey = scrypt(passphrase, saltBuffer, kdfparams.N, kdfparams.p, kdfparams.r, kdfparams.dkLen);
    const currentMac = SHA3(
      `${decryptionKey.slice(16, 32)}${mnemonicEncrypted}${privateKeyEncrypted}`,
      {
        outputLength: 256
      }
    );
    if (currentMac.toString(encHex) !== mac) {
      error = { ...KEY_STORE_ERRORS.INVALID_PASSWORD };
    } else {
      result = true;
    }
  }
  return new Promise((resolve, reject) => {
    callback(error, result);
    if (error) {
      reject(error);
    } else {
      resolve(true);
    }
  });
};
