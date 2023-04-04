import HDNode = require("hdkey");
import * as Bip39 from "bip39";
import { ec, curve } from "elliptic";
import { ITransaction } from "../util/proto";
import * as KeyStore from "../util/keyStore";
import { TRawTx } from 'types/contract/contractMethod';

export default Wallet;

interface ISignature {
  signature: Uint8Array;
}
type TSignTransaction = ISignature & TRawTx;

export interface IWallet {
  BIP44Path: string;
  address: string;
  childWallet: IWallet | string;
  keyPair: ec.KeyPair;
  mnemonic: string;
  privateKey: string;
}

declare class Wallet {
  ellipticEc: ec;
  hdkey: HDNode;
  bip39: typeof Bip39;
  keyStore: typeof KeyStore;
  AESEncrypt(input: string, password: string): string;
  AESDescrypt(input: string, password: string): string;
  getSignature(bytesToBeSign: string, keyPair: ec.KeyPair): Buffer;
  getAddressFromPubKey(pubKey: curve.base.BasePoint): string;
  createNewWallet(BIP44Path?: string): IWallet;
  getWalletByMnemonic(mnemonic: string, BIP44Path: string): IWallet;
  getWalletByPrivateKey(privateKey: string): IWallet;
  signTransaction(rawTxn: ITransaction, keyPair: ec.KeyPair): TSignTransaction;
  sign(hexString: string, keyPair: ec.KeyPair): Buffer;
}
