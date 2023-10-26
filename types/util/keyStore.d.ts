import { IWallet } from '../wallet';

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
type TWalletInfo = IWallet & {
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
  address: string;
  crypto: ICrypto;
}
export declare function getKeystore(
  walletInfoInput: TWalletInfo,
  password: string,
  option?: IOptions & Record<string, any>
): IkeyStore;
export declare function unlockKeystore(
  keyStoreInput: IkeyStore,
  password: string
): TWalletInfo;
export declare function checkPassword(
  keyStoreInput: IkeyStore,
  password: string
): boolean;
