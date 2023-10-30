import HDNode = require('hdkey');
import * as Bip39 from 'bip39';
import { ec, curve } from 'elliptic';
import { ITransaction } from '../util/proto';
import * as KeyStore from '../util/keyStore';
import { TRawTx } from 'types/contract/contractMethod';

interface ISignature {
  signature: Uint8Array;
}
type TSignTransaction = ISignature & TRawTx;

export interface IWalletInfo {
  BIP44Path: string;
  address: string;
  childWallet: IWalletInfo | string;
  keyPair: ec.KeyPair;
  mnemonic: string;
  privateKey: string;
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
  createNewWallet(BIP44Path?: string): IWalletInfo;
  getWalletByMnemonic(mnemonic: string, BIP44Path: string): IWalletInfo;
  getWalletByPrivateKey(privateKey: string): IWalletInfo;
  signTransaction(rawTxn: ITransaction, keyPair: ec.KeyPair): TSignTransaction;
  sign(hexString: string, keyPair: ec.KeyPair): Buffer;
}
export declare class Wallet implements IWallet{
  ellipticEc: ec;
  hdkey: HDNode;
  bip39: typeof Bip39;
  keyStore: typeof KeyStore;
  AESEncrypt(input: string, password: string): string;
  AESDescrypt(input: string, password: string): string;
  getSignature(bytesToBeSign: string, keyPair: ec.KeyPair): Buffer;
  getAddressFromPubKey(pubKey: curve.base.BasePoint): string;
  createNewWallet(BIP44Path?: string): IWalletInfo;
  getWalletByMnemonic(mnemonic: string, BIP44Path: string): IWalletInfo;
  getWalletByPrivateKey(privateKey: string): IWalletInfo;
  signTransaction(rawTxn: ITransaction, keyPair: ec.KeyPair): TSignTransaction;
  sign(hexString: string, keyPair: ec.KeyPair): Buffer;
}
export default Wallet;
