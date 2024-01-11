import { IWalletInfo } from '../wallet';
import { TAddress } from './proto';

interface IOptions {
  dklen: number;
  n: number;
  r: number;
  p: number;
  cipher: string;
}
interface IKdfparams {
  dklen: number;
  n: number;
  r: number;
  p: number;
  salt: string;
}
type TWalletInfoObject = IWalletInfo & {
  nickName?: string;
};
interface ICipherparams {
  iv: string;
}
interface ICrypto {
  cipher: string;
  cipherparams: ICipherparams;
  ciphertext: string;
  kdf: string;
  kdfparams: IKdfparams;
  mac: string;
  mnemonicEncrypted: string;
}
interface IkeyStore {
  version: number;
  type: string;
  nickName?: string;
  address: TAddress;
  crypto: Crypto;
}
export declare function getKeystore(
  walletInfoInput: TWalletInfoObject,
  password: string,
  option?: IOptions & Record<string, any>
): IkeyStore;
export declare function unlockKeystore(
  keyStoreInput: IkeyStore,
  password: string
): TWalletInfoObject;
export declare function checkPassword(
  keyStoreInput: IkeyStore,
  password: string
): boolean;
