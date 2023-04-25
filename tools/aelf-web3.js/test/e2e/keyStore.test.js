import wallet from '../../src/wallet';
import {
  getKeystore,
  checkPassword,
  unlockKeystore
} from '../../src/util/keyStore';

describe('test keyStore', () => {
  const privateKey = 'a831378a02a765c577de1c2f69800c905f5dd410940eb08e7711fb38c6de18b5';
  const mnemonic = 'orange learn result add snack curtain double state expose bless also clarify';
  const walletInstance = wallet.getWalletByMnemonic(mnemonic);
  const defaultPassword = '123123';
  let keyStore = null;
  test('test keyStore', () => {
    keyStore = getKeystore(walletInstance, defaultPassword, {
      cipher: 'aes-256-cbc'
    });
    const { mnemonic: ksMn, privateKey } = unlockKeystore(keyStore, defaultPassword);
    expect(privateKey).toEqual(privateKey);
    expect(ksMn).toEqual(mnemonic);
    expect(checkPassword(keyStore, defaultPassword)).toBeTruthy();
  });
});
