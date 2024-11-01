/**
 * @file wallet
 * @author atom-yang
 */
import elliptic from 'elliptic';
import * as bip39 from 'bip39';
import hdkey from 'hdkey';
import AES from 'crypto-js/aes.js';
import encUTF8 from 'crypto-js/enc-utf8.js';
import BN from 'bn.js';
import sha256 from '../util/sha256.js';
import * as keyStore from '../util/keyStore.js';
import { encodeAddressRep, padLeft } from '../util/utils.js';
import { Transaction } from '../util/proto.js';

// eslint-disable-next-line new-cap
const ellipticEc = new elliptic.ec('secp256k1');

// ... (other functions remain unchanged)

/**
 * sign a transaction
 *
 * @alias module:AElf/wallet
 * @param {Object} rawTxn rawTxn
 * @param {Object} keyPair Any standard key pair
 * @param {string} [password] Optional password for encrypted private keys
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
const signTransaction = (rawTxn, keyPair, password) => {
  let { params } = rawTxn;
  if (params.length === 0) {
    params = null;
  }
  // proto in proto.Transaction use proto2, but C# use proto3
  // proto3 will remove the default value key.
  // The differences between proto2 and proto3:
  // https://blog.csdn.net/huanggang982/article/details/77944174
  const ser = Transaction.encode(rawTxn).finish();
  let privateKey = keyPair.getPrivate('hex');
  
  if (password) {
    // Decrypt the private key if a password is provided
    privateKey = AESDecrypt(privateKey, password);
  }
  
  const sigObj = ellipticEc.sign(Buffer.from(sha256(ser), 'hex'), privateKey, 'hex', {
    canonical: true
  });
  const sig = Buffer.from(
    [sigObj.r.toString('hex', 32), sigObj.s.toString('hex', 32), `0${sigObj.recoveryParam.toString()}`].join(''),
    'hex'
  );
  return {
    ...rawTxn,
    params,
    signature: sig
  };
};

// ... (other functions remain unchanged)

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
