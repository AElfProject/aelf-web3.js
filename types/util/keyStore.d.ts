import { WalletInfo } from '../wallet';
import { Address } from './proto';

interface Options {
  dklen: number;
  n: number;
  r: number;
  p: number;
  cipher: string;
}
interface Kdfparams {
  dklen: number;
  n: number;
  r: number;
  p: number;
  salt: string;
}
type WalletInfoObject = WalletInfo & {
  nickName?: string;
};
interface Cipherparams {
  iv: string;
}
interface Crypto {
  cipher: string;
  cipherparams: Cipherparams;
  ciphertext: string;
  kdf: string;
  kdfparams: Kdfparams;
  mac: string;
  mnemonicEncrypted: string;
}
interface keyStore {
  version: number;
  type: string;
  nickName?: string;
  address: Address;
  crypto: Crypto;
}
export declare function getKeystore(
  walletInfoInput: WalletInfoObject,
  password: string,
  option?: Options & Record<string, any>
): keyStore;
export declare function unlockKeystore(
  keyStoreInput: keyStore,
  password: string
): WalletInfoObject;
export declare function checkPassword(
  keyStoreInput: keyStore,
  password: string
): boolean;
