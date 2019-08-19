/**
 * @file AElf keyStore tools
 * @author atom-yang
 */
import scrypt from 'scryptsy';
import { createCipheriv, createDecipheriv } from 'browserify-cipher';
import randomBytes from 'randombytes';
import { keccak256 } from './hash';
import { KEY_STORE_ERRORS } from '../common/constants';

const defaultOptions = {
  dklen: 32,
  n: 8192, // 2048 4096 8192 16384
  r: 8,
  p: 1,
  cipher: 'aes-128-ctr'
};

/**
 * getKeyStoreFromV1
 *
 * @method getKeyStoreFromV1
 * @param {Object} walletInfoInput  walletInfo
 * @param {string} password password
 * @param {Object} option option
 * @return {Object} keyStore
 */
function getKeyStoreFromV1(
  {
    mnemonic,
    privateKey,
    nickName = '',
    address = ''
  },
  password,
  option = defaultOptions
) {
  const opt = {
    ...defaultOptions,
    ...option
  };
  const { cipher = 'aes-128-ctr' } = opt;
  const sliceLength = /128/.test(cipher) ? 16 : 32;
  const salt = randomBytes(32); // instance of Buffer
  const iv = randomBytes(16); // instance of Buffer
  const derivedKey = scrypt(
    Buffer.from(password, 'utf8'),
    salt,
    opt.n,
    opt.r,
    opt.p,
    opt.dklen
  ); // instance of Buffer
  const privateKeyCipher = createCipheriv(cipher, derivedKey.slice(0, sliceLength), iv);
  const privateKeyEncrypted = Buffer.concat([
    privateKeyCipher.update(Buffer.from(privateKey, 'hex')),
    privateKeyCipher.final()
  ]);
  const mnemonicCipher = createCipheriv(cipher, derivedKey.slice(0, sliceLength), iv);
  const mnemonicEncrypted = Buffer.concat([
    mnemonicCipher.update(Buffer.from(mnemonic, 'utf8')),
    mnemonicCipher.final()
  ]);
  const rawMac = Buffer.concat([derivedKey.slice(16, 32), privateKeyEncrypted]);
  const mac = keccak256(rawMac).replace('0x', '');
  return {
    version: 1,
    type: 'aelf',
    nickName,
    address,
    // todo: have to use uuid?
    // id: uuid,
    crypto: {
      cipher,
      ciphertext: privateKeyEncrypted.toString('hex'),
      cipherparams: {
        iv: iv.toString('hex')
      },
      mnemonicEncrypted: mnemonicEncrypted.toString('hex'),
      privateKeyEncrypted: privateKeyEncrypted.toString('hex'),
      kdf: 'scrypt',
      kdfparams: {
        r: opt.r,
        n: opt.n,
        p: opt.p,
        dkLen: opt.dklen,
        salt: salt.toString('hex')
      },
      mac
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
 */
function unlockKeyStoreFromV1(
  {
    crypto,
    type,
    nickName = '',
    address = '',
    version = 1
  },
  password
) {
  let error = null;
  let result = null;
  const {
    kdfparams,
    mac,
    cipherparams,
    mnemonicEncrypted,
    privateKeyEncrypted,
    cipher = 'aes-128-ctr'
  } = crypto;
  if (+version !== 1) {
    error = { ...KEY_STORE_ERRORS.WRONG_KEY_STORE_VERSION };
    throw error;
  }
  if (type !== 'aelf') {
    error = { ...KEY_STORE_ERRORS.NOT_AELF_KEY_STORE };
    throw error;
  }
  const sliceLength = /128/.test(cipher) ? 16 : 32;
  const iv = Buffer.from(cipherparams.iv, 'hex');
  const derivedKey = scrypt(
    Buffer.from(password),
    Buffer.from(kdfparams.salt, 'hex'),
    kdfparams.n,
    kdfparams.r,
    kdfparams.p,
    kdfparams.dkLen
  );
  const rawMac = Buffer.concat([derivedKey.slice(16, 32), Buffer.from(privateKeyEncrypted, 'hex')]);
  const currentMac = keccak256(rawMac).replace('0x', '');
  if (currentMac === mac) {
    const privateKeyDeCipher = createDecipheriv(cipher, derivedKey.slice(0, sliceLength), iv);
    const privateKey = Buffer.concat([
      privateKeyDeCipher.update(Buffer.from(privateKeyEncrypted, 'hex')),
      privateKeyDeCipher.final()
    ]).toString('hex');

    const mnemonicDeCipher = createDecipheriv(cipher, derivedKey.slice(0, sliceLength), iv);
    const mnemonic = Buffer.concat([
      mnemonicDeCipher.update(Buffer.from(mnemonicEncrypted, 'hex')),
      mnemonicDeCipher.final()
    ]).toString('utf8');
    result = {
      nickName,
      address,
      mnemonic,
      privateKey
    };
  } else {
    error = { ...KEY_STORE_ERRORS.INVALID_PASSWORD };
    throw error;
  }

  return result;
}

/**
 * getKeystore
 *
 * @method getKeystore
 * @param {Object} walletInfoInput  walletInfo
 * @param {string} password password
 * @params {Object} options custom options
 * @param {number} version version
 * @return {Object}
 */
export const getKeystore = (walletInfoInput, password, options = {}, version = 1) => {
  if (+version === 1) {
    return getKeyStoreFromV1(walletInfoInput, password, options);
  }
  const error = { ...KEY_STORE_ERRORS.WRONG_VERSION };
  throw error;
};


/**
 * unlock keyStore
 * @method unlockKeystore
 * @param {Object} keyStoreInput  walletInfo
 * @param {string} password password
 * @returns {Object}
 */
export const unlockKeystore = (keyStoreInput, password) => {
  const { version } = keyStoreInput;
  if (+version === 1) {
    return unlockKeyStoreFromV1(keyStoreInput, password);
  }
  const error = { ...KEY_STORE_ERRORS.WRONG_VERSION };
  throw error;
};

/**
 * checkPassword
 *
 * @method checkPassword
 * @param {Object} keyStoreInput  keyStoreInput
 * @param {string} password password
 * @return {boolean} true or false
 */
export const checkPassword = (
  keyStoreInput,
  password
) => {
  try {
    const result = unlockKeyStoreFromV1(keyStoreInput, password);
    return !!result.privateKey;
  } catch (e) {
    return false;
  }
};
