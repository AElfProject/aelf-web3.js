import HDNode = require('hdkey');
import * as Bip39 from 'bip39';
import { ec, curve } from 'elliptic';
import { RawTransaction, Address } from '../util/proto';
import * as KeyStore from '../util/keyStore';
import { RawTx } from '../contract/contractMethod';

type BIP44Path = string;
type Mnemonic = string;
type PrivateKey = string;
interface SignatureObject {
  signature: Uint8Array;
}
type SignTransaction = SignatureObject & RawTx;

export interface WalletInfo {
  BIP44Path: BIP44Path;
  address: Address;
  childWallet: WalletInfo | string;
  keyPair: ec.KeyPair;
  mnemonic: Mnemonic;
  privateKey: PrivateKey;
}

interface IWallet {
  ellipticEc: ec;
  hdkey: HDNode;
  bip39: typeof Bip39;
  keyStore: typeof KeyStore;
  AESEncrypt(input: string, password: string): string;
  AESDescrypt(input: string, password: string): string;
  getSignature(bytesToBeSign: string, keyPair: ec.KeyPair): Buffer;
  getAddressFromPubKey(pubKey: curve.base.BasePoint): string;
  createNewWallet(BIP44Path?: BIP44Path): WalletInfo;
  getWalletByMnemonic(mnemonic: Mnemonic, BIP44Path: BIP44Path): WalletInfo;
  getWalletByPrivateKey(privateKey: PrivateKey): WalletInfo;
  signTransaction(
    rawTxn: RawTransaction,
    keyPair: ec.KeyPair
  ): SignTransaction;
  sign(hexString: string, keyPair: ec.KeyPair): Buffer;
}
export declare class Wallet implements IWallet {
  ellipticEc: ec;
  hdkey: HDNode;
  bip39: typeof Bip39;
  keyStore: typeof KeyStore;
  AESEncrypt(input: string, password: string): string;
  AESDescrypt(input: string, password: string): string;
  getSignature(bytesToBeSign: string, keyPair: ec.KeyPair): Buffer;
  getAddressFromPubKey(pubKey: curve.base.BasePoint): string;
  createNewWallet(BIP44Path?: BIP44Path): WalletInfo;
  getWalletByMnemonic(mnemonic: Mnemonic, BIP44Path: BIP44Path): WalletInfo;
  getWalletByPrivateKey(privateKey: PrivateKey): WalletInfo;
  signTransaction(
    rawTxn: RawTransaction,
    keyPair: ec.KeyPair
  ): SignTransaction;
  sign(hexString: string, keyPair: ec.KeyPair): Buffer;
}
export default Wallet;
