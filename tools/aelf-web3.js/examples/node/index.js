/* eslint-env node */
const AElf = require('../../dist/aelf.cjs');

const Wallet = AElf.wallet;
const { sha256 } = AElf.utils;

// address: 2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX
const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';

// const walletCreatedByMethod = Wallet.createNewWallet();
const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);
// link to Blockchain
const aelf = new AElf(new AElf.providers.HttpProvider('http://18.162.41.20:8000'));

if (!aelf.isConnected()) {
  console.log('Blockchain Node is not running.');
}

// the contract you want to query
const tokenContractName = 'AElf.ContractNames.Token';
const {
  // directly accessible information
  GenesisContractAddress
} = aelf.chain.getChainStatus({sync: true});
aelf.chain.contractAt(GenesisContractAddress, wallet)
  .then(zeroC => {
    // return contract's address which you query by contract's name
    return zeroC.GetContractAddressByName.call(sha256(tokenContractName));
  })
  .then(tokenContractAddress => {
    // return contract's instance and you can call the methods on this instance
    return aelf.chain.contractAt(tokenContractAddress, wallet);
  })
  .then(tokenContract => {
    // return token's info
    return tokenContract.GetTokenInfo.call({
      symbol: 'ELF'
    });
  })
  .then(res => {
    console.log(res);
  });

const defaultPassword = '123123';
keyStore = AElf.wallet.keyStore.getKeystore(wallet, defaultPassword);
const { mnemonic: ksMn, privateKey } = AElf.wallet.keyStore.unlockKeystore(keyStore, defaultPassword);

console.log(keyStore, privateKey);
