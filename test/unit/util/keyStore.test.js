import wallet from '../../../src/wallet';
import { getKeystore, checkPassword, unlockKeystore } from '../../../src/util/keyStore';

describe('test keyStore', () => {
  const PrivateKey = 'cc2895b46707a34eefd3c61bd4a8487266e0398a93309a9910a2b88e587b6582';
  const mnemonic = 'orange learn result add snack curtain double state expose bless also clarify';
  const walletInstance = wallet.getWalletByMnemonic(mnemonic);
  const defaultPassword = '123123';
  let keyStore = null;
  test('test get keyStore', () => {
    keyStore = getKeystore(walletInstance, defaultPassword, {
      cipher: 'aes-256-cbc'
    });
    const { mnemonic: ksMn, privateKey } = unlockKeystore(keyStore, defaultPassword);
    expect(privateKey).toEqual(PrivateKey);
    expect(ksMn).toEqual(mnemonic);
  });
  test('test get keyStore without kdfparams dklen', () => {
    const keyStoreWithoutParams = getKeystore(walletInstance, defaultPassword, {
      cipher: 'aes-256-cbc'
    });
    keyStoreWithoutParams.crypto.kdfparams.dkLen = keyStoreWithoutParams.crypto.kdfparams.dklen;
    delete keyStoreWithoutParams.crypto.kdfparams.dklen;
    const { mnemonic: ksMn, privateKey } = unlockKeystore(keyStoreWithoutParams, defaultPassword);
    expect(privateKey).toEqual(PrivateKey);
    expect(ksMn).toEqual(mnemonic);
  });
  test('test get keyStore with default cipher', () => {
    const wallet = Object.assign({}, walletInstance);
    delete wallet.nickName;
    delete wallet.address;
    const keyStoreDefault = getKeystore(wallet, defaultPassword);
    delete keyStoreDefault.nickName;
    delete keyStoreDefault.address;
    delete keyStoreDefault.crypto.mnemonicEncrypted;
    delete keyStoreDefault.crypto.cipher;
    const { mnemonic: ksMn, privateKey } = unlockKeystore(keyStoreDefault, defaultPassword);
    expect(privateKey).toEqual(PrivateKey);
    expect(ksMn).toEqual('');
  });
  test('test get keyStore with no exist cipher', () => {
    expect(() =>
      getKeystore(walletInstance, defaultPassword, {
        cipher: 'test'
      })
    ).toThrow('Unknown cipher');
  });
  test('test get keyStore with undefined cipher', () => {
    expect(
      getKeystore(walletInstance, defaultPassword, {
        cipher: undefined
      }).crypto.cipher
    ).toEqual('aes-128-ctr');
  });
  test('test check password', () => {
    expect(checkPassword(keyStore, defaultPassword)).toBeTruthy();
  });
  test('test wrong  password', () => {
    expect(checkPassword(keyStore, '1234')).toBeFalsy();
  });
});
