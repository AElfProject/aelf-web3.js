import AElf from '../../src/index';
let aelf = null;
describe('test wallet', () => {
  test('create instance', () => {
    aelf = new AElf(new AElf.providers.HttpProvider('http://34.213.112.35:8000'));
    expect(aelf).toBeDefined();
    expect(aelf.isConnected()).toBeTruthy();
    expect(aelf.chain).toBeTruthy();
  });

  test('test wallet method', () => {
    const address = 'YxE2zSWev5AGuBNtStW5Mdw8HyVtcZ8X5vYmKAx9yZ7dPnRo5';
    const mnemonic = 'orange learn result add snack curtain double state expose bless also clarify';
    const privateKey = 'a831378a02a765c577de1c2f69800c905f5dd410940eb08e7711fb38c6de18b5';
    const walletGotByKey = AElf.wallet.getWalletByPrivateKey(privateKey);
    const walletGotByMn = AElf.wallet.getWalletByMnemonic(mnemonic);
    expect(walletGotByKey.address).toEqual(address);
    expect(walletGotByMn.privateKey).toEqual(privateKey);
    expect(walletGotByKey.address).toEqual(address);
  }, 60000);

  test('test create new wallet', () => {
    const {address, mnemonic, privateKey} = AElf.wallet.createNewWallet();
    const walletGotByKey = AElf.wallet.getWalletByPrivateKey(privateKey);
    const walletGotByMn = AElf.wallet.getWalletByMnemonic(mnemonic);
    expect(walletGotByKey.address).toEqual(address);
    expect(walletGotByMn.privateKey).toEqual(privateKey);
    expect(walletGotByKey.address).toEqual(address);
  });
});
