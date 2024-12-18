import AElf from '../../src/index';
let aelf = null;
const address = 'YxE2zSWev5AGuBNtStW5Mdw8HyVtcZ8X5vYmKAx9yZ7dPnRo5';
const mnemonic = 'orange learn result add snack curtain double state expose bless also clarify';
const privateKey = 'a831378a02a765c577de1c2f69800c905f5dd410940eb08e7711fb38c6de18b5';
describe('test wallet', () => {
  test('create instance', () => {
    aelf = new AElf(new AElf.providers.HttpProvider('https://explorer-test.aelf.io/chain'));
    expect(aelf).toBeDefined();
    expect(aelf.isConnected()).toBeTruthy();
    expect(aelf.chain).toBeTruthy();
  });

  test('test wallet method', () => {
    const walletGetByKey = AElf.wallet.getWalletByPrivateKey(privateKey);
    const walletGetByMn = AElf.wallet.getWalletByMnemonic(mnemonic);
    expect(walletGetByKey.address).toEqual(address);
    expect(walletGetByMn.privateKey).toEqual(privateKey);
    expect(walletGetByMn.address).toEqual(address);
  }, 60000);

  test('test create new wallet', () => {
    const { address, mnemonic, privateKey } = AElf.wallet.createNewWallet();
    const walletGotByKey = AElf.wallet.getWalletByPrivateKey(privateKey);
    const walletGotByMn = AElf.wallet.getWalletByMnemonic(mnemonic);
    expect(walletGotByKey.address).toEqual(address);
    expect(walletGotByMn.privateKey).toEqual(privateKey);
    expect(walletGotByMn.address).toEqual(address);
  });

  test('test check new wallet address', () => {
    const { address, mnemonic, privateKey } = AElf.wallet.createNewWallet();
    const walletGotByKey1 = AElf.wallet.getWalletByPrivateKey(privateKey);
    const walletGotByMn1 = AElf.wallet.getWalletByMnemonic(mnemonic);
    expect(walletGotByKey1.address).toEqual(address);
    expect(walletGotByMn1.address).toEqual(address);

    const walletGotByKey2 = AElf.wallet.getWalletByPrivateKey(privateKey);
    const walletGotByMn2 = AElf.wallet.getWalletByMnemonic(mnemonic);
    expect(walletGotByKey2.address).toEqual(address);
    expect(walletGotByMn2.address).toEqual(address);

    const walletGotByKey3 = AElf.wallet.getWalletByPrivateKey(privateKey);
    const walletGotByMn3 = AElf.wallet.getWalletByMnemonic(mnemonic);

    expect(walletGotByKey3.address).toEqual(address);
    expect(walletGotByMn3.address).toEqual(address);
  });

  test('test get address from public key', () => {
    var wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
    expect(wallet).toBeDefined();
    var pubkey = wallet.keyPair.getPublic();
    var addressInfo = AElf.wallet.getAddressFromPubKey(pubkey);
    expect(addressInfo).toEqual(address);
  });
});
