import AElf from '../../src/index';
let aelf = null;
const address = 'YxE2zSWev5AGuBNtStW5Mdw8HyVtcZ8X5vYmKAx9yZ7dPnRo5';
const mnemonic = 'orange learn result add snack curtain double state expose bless also clarify';
const privateKey = 'a831378a02a765c577de1c2f69800c905f5dd410940eb08e7711fb38c6de18b5';
describe('test wallet', () => {
  test('create instance', () => {
    aelf = new AElf(new AElf.providers.HttpProvider('http://18.162.41.20:8000'));
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
    const {
      address,
      mnemonic,
      privateKey
    } = AElf.wallet.createNewWallet();
    const walletGetByKey = AElf.wallet.getWalletByPrivateKey(privateKey);
    const walletGetByMn = AElf.wallet.getWalletByMnemonic(mnemonic);
    expect(walletGetByKey.address).toEqual(address);
    expect(walletGetByMn.privateKey).toEqual(privateKey);
    expect(walletGetByMn.address).toEqual(address);
  });


  test("test check new wallet address", () => {
    const { address, mnemonic, privateKey } = AElf.wallet.createNewWallet();
    const walletGetByKey1 = AElf.wallet.getWalletByPrivateKey(privateKey);
    const walletGetByMn1 = AElf.wallet.getWalletByMnemonic(mnemonic);
    expect(walletGetByKey1.address).toEqual(address);
    expect(walletGetByMn1.address).toEqual(address);

    const walletGetByKey2 = AElf.wallet.getWalletByPrivateKey(privateKey);
    const walletGetByMn2 = AElf.wallet.getWalletByMnemonic(mnemonic);
    expect(walletGetByKey2.address).toEqual(address);
    expect(walletGetByMn2.address).toEqual(address);

    const walletGetByKey3 = AElf.wallet.getWalletByPrivateKey(privateKey);
    const walletGetByMn3 = AElf.wallet.getWalletByMnemonic(mnemonic);

    expect(walletGetByKey3.address).toEqual(address);
    expect(walletGetByMn3.address).toEqual(address);
  });

  test('test get address from public key', () => {
    var wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
    expect(wallet).toBeDefined()
    var pubkey = wallet.keyPair.getPublic();
    var addressInfo = AElf.wallet.getAddressFromPubKey(pubkey);
    expect(addressInfo).toEqual(address);
  });
});
