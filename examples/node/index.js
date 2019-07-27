/* eslint-env node */
const AElf = require('../../dist/aelf.cjs');

const Wallet = AElf.wallet;
const { sha256 } = AElf.utils;

const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';

// const walletCreatedByMethod = Wallet.createNewWallet();
const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);
const aelf = new AElf(new AElf.providers.HttpProvider('http://18.162.41.20:8000')); //set up link with Blockchain

if (!aelf.isConnected()) {
  console.log('Blockchain Node is not running.');
}

const tokenContractName = 'AElf.ContractNames.Token';
const {
  GenesisContractAddress
} = aelf.chain.getChainStatus({sync: true});
aelf.chain.contractAt(GenesisContractAddress, wallet)
  .then(zeroC => {
    return zeroC.GetContractAddressByName.call(sha256(tokenContractName));
  }).then(tokenContractAddress => {
    return aelf.chain.contractAt(tokenContractAddress, wallet);
  }).then(tokenContract => {
    return tokenContract.GetTokenInfo.call({
      symbol: 'ELF'
    });
  })
  .then(res => {
    console.log(res);
  });

  /* explain for above code block
    1. we can get genesisContract's address and the contract's name which we want to know.
    2. transmit address and wallet to function contractAt, we can get an living example about the address
    3. first get exmaple by genesisiContractAddress,so we can get contract's address by contract's name.
        then according contract's address get contract's information.
  */

const defaultPassword = '123123';
keyStore = AElf.wallet.keyStore.getKeystore(wallet, defaultPassword);
const { mnemonic: ksMn, privateKey } = AElf.wallet.keyStore.unlockKeystore(keyStore, defaultPassword);

console.log(keyStore, privateKey);
