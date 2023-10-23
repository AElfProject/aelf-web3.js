import AElf from '../../src/index';
let aelf = null;
const address = "SbWhnq3XU8yeiUTYJmZBSgt7ekgszRXHxh8qNqkFj9g6d3bWh";
const mnemonic = 'orange learn result add snack curtain double state expose bless also clarify';
const privateKey =
  "cc2895b46707a34eefd3c61bd4a8487266e0398a93309a9910a2b88e587b6582";
describe('test wallet', () => {
  test('create instance',() => {
    aelf = new AElf(
      new AElf.providers.HttpProvider("https://aelf-test-node.aelf.io")
    );
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
