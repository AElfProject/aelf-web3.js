import { getTransaction } from '../../../src/util/proto';
import Wallet from '../../../src/wallet/index';
import sha256 from '../../../src/util/sha256';
describe('test wallet', () => {
  test('test create new wallet', () => {
    const result = Wallet.createNewWallet();
    expect(typeof result.mnemonic).toBe('string');
    expect(result.BIP44Path).toBe("m/44'/1616'/0'/0/0");
    expect(result).toHaveProperty('keyPair');
    expect(result).toHaveProperty('childWallet');
    expect(result).toHaveProperty('privateKey');
    expect(result).toHaveProperty('address');
  });
  test('test get wallet by mnemonic', () => {
    const mnemonic =
      'history segment pizza all time regret robust animal loud gasp razor gadget';
    const result = Wallet.getWalletByMnemonic(mnemonic);
    expect(result.mnemonic).toBe(mnemonic);
    const wrongMnemonic = 'hello world';
    const wrongResult = Wallet.getWalletByMnemonic(wrongMnemonic);
    expect(wrongResult).toBe(false);
  });
  test('test get wallet by private key', () => {
    const privateKey =
      '03bd0cea9730bcfc8045248fd7f4841ea19315995c44801a3dfede0ca872f808';
    const result = Wallet.getWalletByPrivateKey(privateKey);
    expect(result.privateKey).toBe(privateKey);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const resultBuffer = Wallet.getWalletByPrivateKey(privateKeyBuffer);
    expect(resultBuffer.privateKey).toBe(privateKey);
  });
  test('test get address from pubKey', () => {
    const privateKey =
      '03bd0cea9730bcfc8045248fd7f4841ea19315995c44801a3dfede0ca872f808';
    const wallet = Wallet.getWalletByPrivateKey(privateKey);
    const pubKey = wallet.keyPair.getPublic();
    const result = Wallet.getAddressFromPubKey(pubKey);
    expect(result).toBe('AALvKqxVo4Kz2QS5jXQ6oYRo9LGqwi8U56DRYKWZKSpfKrfzq');
  });
  test('test sign transaction', () => {
    const rawTxn = getTransaction(
      'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9',
      'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9',
      'test',
      ['hello', 'world']
    );
    const privateKey =
      '03bd0cea9730bcfc8045248fd7f4841ea19315995c44801a3dfede0ca872f808';
    const wallet = Wallet.getWalletByPrivateKey(privateKey);
    const signWallet = Wallet.signTransaction(rawTxn, wallet.keyPair);
    expect(signWallet).toHaveProperty('signature');
    expect(signWallet.signature).toBeInstanceOf(Buffer);
    expect(signWallet.signature.toString('hex')).toBe(
      'a3518c1487e019f1de7dca2ea628044f559200a6215c213f7c10cd27e86984d236e056d5b0db6123d6b52e4cb8be5a883c32508f1daef16158907c894154b20b01'
    );
    const rawTxnNullParams = getTransaction(
      'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9',
      'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9',
      'test',
      []
    );
    const privateKeyNullParams =
      '03bd0cea9730bcfc8045248fd7f4841ea19315995c44801a3dfede0ca872f808';
    const walletNullParams = Wallet.getWalletByPrivateKey(privateKeyNullParams);
    const signWalletNullParams = Wallet.signTransaction(
      rawTxnNullParams,
      walletNullParams.keyPair
    );
    expect(signWalletNullParams).toHaveProperty('signature');
    expect(signWalletNullParams.signature).toBeInstanceOf(Buffer);
    expect(signWalletNullParams.signature.toString('hex')).toBe(
      'd71aed3a50539a1f7e7e5a797df61f7f23643a3c75af6718b528910be1f146ea398e68b9fd3934d9795025ccb7428378298c634d661ce7661b1034c5507b587301'
    );
  });
  test('test sign', () => {
    const privateKey =
      '03bd0cea9730bcfc8045248fd7f4841ea19315995c44801a3dfede0ca872f808';
    const wallet = Wallet.getWalletByPrivateKey(privateKey);
    const result = Wallet.sign('68656c6c6f20776f726c64', wallet.keyPair);
    expect(result.toString('hex')).toBe(
      '276aa36fcab0ac3d4071a4bfb868f636d1a9639916afe4ec329529014f923a372b688b4eb59d6587481bc15e4a1684e1d92b7598967767713d1504dcea83dadb01'
    );
  });
  test('test AESEncrypt and AESDecrypt', () => {
    const AESEncryptPrivateKey = Wallet.AESEncrypt('123', '123');
    expect(typeof AESEncryptPrivateKey).toBe('string');
    const AESDecryptPrivateKey = Wallet.AESDecrypt(AESEncryptPrivateKey, '123');
    expect(AESDecryptPrivateKey).toBe('123');
  });
  test('test get wallet with error', () => {
    const _getWallet = Wallet.__GetDependency__('_getWallet');
    expect(() => _getWallet()).toThrow('not a valid method');
  });

  test('test verify', () => {
    const privateKey =
      '03bd0cea9730bcfc8045248fd7f4841ea19315995c44801a3dfede0ca872f808';
    const wallet = Wallet.getWalletByPrivateKey(privateKey);
    const signature =
      '276aa36fcab0ac3d4071a4bfb868f636d1a9639916afe4ec329529014f923a372b688b4eb59d6587481bc15e4a1684e1d92b7598967767713d1504dcea83dadb01';
    const pubKey = wallet.keyPair.getPublic('hex');
    const msgHash =
      'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
    const isValid = Wallet.verify(signature.toString('hex'), msgHash, pubKey);
    expect(isValid).toBe(true);
  });
});
