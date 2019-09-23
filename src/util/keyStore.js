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
 * getKeyStore
 *
 * @method getKeyStore
 * @param {Object} walletInfoInput  walletInfo
 * @param {string} password password
 * @param {Object} option option
 * @return {Object} keyStore
 */
export function getKeystore(
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
    crypto: {
      cipher,
      ciphertext: privateKeyEncrypted.toString('hex'),
      cipherparams: {
        iv: iv.toString('hex')
      },
      mnemonicEncrypted: mnemonicEncrypted.toString('hex'),
      kdf: 'scrypt',
      kdfparams: {
        r: opt.r,
        n: opt.n,
        p: opt.p,
        dklen: opt.dklen,
        salt: salt.toString('hex')
      },
      mac
    }
  };
}

/**
 * unlock AElf key store
 *
 * @method unlockKeystore
 * @param {Object} keyStoreInput  key store input
 * @param {string} password password
 * @return {Object} walletInfo
 */
export function unlockKeystore(
  {
    crypto,
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
    mnemonicEncrypted,
    ciphertext,
    cipher = 'aes-128-ctr'
  } = crypto;
  const sliceLength = /128/.test(cipher) ? 16 : 32;
  const iv = Buffer.from(cipherparams.iv, 'hex');
  const derivedKey = scrypt(
    Buffer.from(password),
    Buffer.from(kdfparams.salt, 'hex'),
    kdfparams.n,
    kdfparams.r,
    kdfparams.p,
    kdfparams.dklen || kdfparams.dkLen
  );
  const rawMac = Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex')]);
  const currentMac = keccak256(rawMac).replace('0x', '');
  if (currentMac === mac) {
    const privateKeyDeCipher = createDecipheriv(cipher, derivedKey.slice(0, sliceLength), iv);
    const privateKey = Buffer.concat([
      privateKeyDeCipher.update(Buffer.from(ciphertext, 'hex')),
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
    const result = unlockKeystore(keyStoreInput, password);
    return !!result.privateKey;
  } catch (e) {
    return false;
  }
};
