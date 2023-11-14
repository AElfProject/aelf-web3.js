import HDNode = require('hdkey');
import * as Bip39 from 'bip39';
import { ec, curve } from 'elliptic';
import { ITransaction, TAddress } from '../util/proto';
import * as KeyStore from '../util/keyStore';
import { TRawTx } from '../contract/contractMethod';

type TBIP44Path = string;
type TMnemonic = string;
type TPrivateKey = string;
interface ISignature {
  signature: Uint8Array;
}
type TSignTransaction = ISignature & TRawTx;

export interface IWalletInfo {
  BIP44Path: TBIP44Path;
  address: TAddress;
  childWallet: IWalletInfo | string;
  keyPair: ec.KeyPair;
  mnemonic: TMnemonic;
  privateKey: TPrivateKey;
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
  createNewWallet(BIP44Path?: TBIP44Path): IWalletInfo;
  getWalletByMnemonic(mnemonic: TMnemonic, BIP44Path: TBIP44Path): IWalletInfo;
  getWalletByPrivateKey(privateKey: TPrivateKey): IWalletInfo;
  signTransaction(rawTxn: ITransaction, keyPair: ec.KeyPair): TSignTransaction;
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
  createNewWallet(BIP44Path?: TBIP44Path): IWalletInfo;
  getWalletByMnemonic(mnemonic: TMnemonic, BIP44Path: TBIP44Path): IWalletInfo;
  getWalletByPrivateKey(privateKey: TPrivateKey): IWalletInfo;
  signTransaction(rawTxn: ITransaction, keyPair: ec.KeyPair): TSignTransaction;
  sign(hexString: string, keyPair: ec.KeyPair): Buffer;
}
export default Wallet;
