/**
 * @file wallet
 * @author atom-yang
 */
import elliptic from 'elliptic';
import * as bip39 from 'bip39';
import hdkey from 'hdkey';
import AES from 'crypto-js/aes';
import encUTF8 from 'crypto-js/enc-utf8';
import BN from 'bn.js';
import sha256 from '../util/sha256';
import * as keyStore from '../util/keyStore';
import {
  encodeAddressRep,
  padLeft
} from '../util/utils';
import { Transaction } from '../util/proto';

// eslint-disable-next-line new-cap
const ellipticEc = new elliptic.ec('secp256k1');

/**
 * Advanced Encryption Standard need crypto-js
 *
 * @alias module:AElf/wallet
 * @param {string} input anything you want to encrypt
 * @param {string} password password
 * @return {string} using base64 encoding way
 *
 * @Example
 * const AESEncryptPrivateKey = aelf.wallet.AESEncrypt('123', '123');
 * // AESEncryptPrivateKey = "U2FsdGVkX1+RYovrVJVEEl8eiIUA3vx4GrNR+3sqOow="
 * const AESEncryptMnemonic = alef.wallet.AESEncrypt('hello world', '123');
 * // AESEncryptMnemonic = U2FsdGVkX19gCjHzYmoY5FGZA1ArXG+eGZIR77dK2GE=
 *
 */
const AESEncrypt = (input, password) => AES.encrypt(input, password).toString();

/**
 * Decrypt any encrypted information you want to decrypt
 *
 * @alias module:AElf/wallet
 * @param {string} input anything you want to decrypt
 * @param {string} password password
 * @return {string} decrypted input, using utf8 decoding way
 *
 * @Example
 * const AESDecryptPrivateKey = aelf.wallet.AESDecrypt('U2FsdGVkX18+tvF7t4rhGOi5cbUvdTH2U5a6Tbu4Ojg=', '123');
 * // AESDecryptPrivateKey = "123"
 * const AESDecryptMnemonic = aelf.wallet.AESDecrypt('U2FsdGVkX19gCjHzYmoY5FGZA1ArXG+eGZIR77dK2GE=', '123');
 * // AESDecryptMnemonic = "hello world"
 */
const AESDecrypt = (input, password) => AES.decrypt(input, password).toString(encUTF8);

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
const getAddressFromPubKey = pubKey => {
  const pubKeyEncoded = pubKey.encode();
  const onceSHAResult = Buffer.from(sha256(pubKeyEncoded), 'hex');
  const hash = sha256(onceSHAResult).slice(0, 64);
  return encodeAddressRep(hash);
};

const _getWallet = (type, value, BIP44Path = 'm/44\'/1616\'/0\'/0/0') => {
  // m/purpose'/coin_type'/account'/change/address_index
  // "m/44'/1616'/0'/0/0"

  let mnemonic = '';
  let rootSeed = '';
  let childWallet = '';
  let keyPair = '';
  let hdWallet;
  switch (type) {
    case 'createNewWallet':
      mnemonic = bip39.generateMnemonic();
      rootSeed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
      hdWallet = hdkey.fromMasterSeed(Buffer.from(rootSeed, 'hex'));
      childWallet = hdWallet.derive(BIP44Path);
      keyPair = ellipticEc.keyFromPrivate(childWallet.privateKey);
      break;
    case 'getWalletByMnemonic':
      mnemonic = value;
      rootSeed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
      hdWallet = hdkey.fromMasterSeed(Buffer.from(rootSeed, 'hex'));
      childWallet = hdWallet.derive(BIP44Path);
      keyPair = ellipticEc.keyFromPrivate(childWallet.privateKey);
      break;
    case 'getWalletByPrivateKey':
      if (typeof value === 'string') {
        keyPair = ellipticEc.keyFromPrivate(padLeft(value, 64, '0'));
      } else {
        keyPair = ellipticEc.keyFromPrivate(value);
      }
      break;
    default:
      throw new Error('not a valid method');
  }
  // let mnemonic = bip39.generateMnemonic();
  // let rootSeed = bip39.mnemonicToSeedHex(mnemonic);
  // let hdWallet = hdkey.fromMasterSeed(Buffer.from(rootSeed, 'hex'));
  // let keyPair = ec.keyFromPrivate(xPrivateKey);
  // TODO 1.将私钥加密保存,用密码解密才能使用。
  // TODO 2.将助记词机密保存,用密码解密才能获取。
  const privateKey = keyPair.getPrivate().toString(16, 64);
  const publicKey = keyPair.getPublic();
  const address = getAddressFromPubKey(publicKey);
  return {
    mnemonic,
    BIP44Path,
    childWallet,
    keyPair,
    privateKey,
    address,
  };
};

/**
 * get signature
 * @param bytesToBeSign
 * @param keyPair
 * @returns {Buffer}
 */
const getSignature = (bytesToBeSign, keyPair) => {
  const privateKey = keyPair.getPrivate('hex');
  const msgHash = sha256(bytesToBeSign);
  const sigObj = ellipticEc.sign(Buffer.from(msgHash, 'hex'), privateKey, 'hex', {
    canonical: true
  });
  const hex = [
    sigObj.r.toString('hex', 32),
    sigObj.s.toString('hex', 32),
    `0${sigObj.recoveryParam.toString()}`
  ].join('');
  return Buffer.from(hex, 'hex');
};

/**
 * create a wallet
 *
 * @alias module:AElf/wallet
 * @param {string} BIP44Path
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
const createNewWallet = (BIP44Path = 'm/44\'/1616\'/0\'/0/0') => _getWallet('createNewWallet', '', BIP44Path);

/**
 * create a wallet by mnemonic
 *
 * @alias module:AElf/wallet
 * @param {string} mnemonic base on bip39
 * @param {string} BIP44Path
 * @return {Object} wallet
 *
 * @Example
 *
 * const mnemonicWallet = aelf.wallet.getWalletByMnemonic('hello world');
 */
const getWalletByMnemonic = (mnemonic, BIP44Path = 'm/44\'/1616\'/0\'/0/0') => {
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
const getWalletByPrivateKey = privateKey => _getWallet('getWalletByPrivateKey', privateKey);

/**
 * sign a transaction
 *
 * @alias module:AElf/wallet
 * @param {Object} rawTxn rawTxn
 * @param {Object} keyPair Any standard key pair
 * @return {Object} wallet
 *
 * @Example
 * const rawTxn = proto.getTransaction(
 *    'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9',
 *    'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9',
 *    'test',
 *    []
 * );
 * const signWallet = aelf.wallet.signTransaction(rawTxn, wallet.keyPair);
 */
const signTransaction = (rawTxn, keyPair) => {
  let { params } = rawTxn;
  if (params.length === 0) {
    params = null;
  }
  // proto in proto.Transaction use proto2, but C# use proto3
  // proto3 will remove the default value key.
  // The differences between proto2 and proto3:
  // https://blog.csdn.net/huanggang982/article/details/77944174
  const ser = Transaction.encode(rawTxn).finish();
  const sig = getSignature(ser, keyPair);
  return {
    ...rawTxn,
    params,
    signature: sig
  };
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
 * buffer = [65, 246, 49, 108, 122, 252, 66, 187, 240, 7, 14, 48, 89,
 * 38, 103, 42, 58, 0, 46, 182, 180, 194, 200, 208, 141, 15, 95, 67,
 * 234, 248, 31, 199, 73, 151, 2, 133, 233, 84, 180, 216, 116, 9, 153,
 * 208, 254, 175, 96, 123, 76, 184, 224, 87, 69, 220, 172, 170, 239, 232,
 * 188, 123, 168, 163, 244, 151, 1]
 */
const sign = (hexString, keyPair) => {
  const bytesToBeSign = Buffer.from(hexString.replace('0x', ''), 'hex');
  return getSignature(bytesToBeSign, keyPair);
};

const verify = (signature, msgHash, pubKey) => {
  const rHex = signature.substring(0, 64);
  const sHex = signature.substring(64, 128);
  const recoveryParamHex = signature.substring(128, 130);
  const sigObj = {
    r: new BN(rHex, 16),
    s: new BN(sHex, 16),
    recoveryParam: recoveryParamHex.slice(1),
  };
  return ellipticEc.verify(msgHash, sigObj, Buffer.from(pubKey, "hex"));
};

export default {
  hdkey,
  bip39,
  sign,
  verify,
  signTransaction,
  createNewWallet,
  getWalletByMnemonic,
  getWalletByPrivateKey,
  getAddressFromPubKey,
  ellipticEc,
  AESEncrypt,
  AESDecrypt,
  keyStore
};
