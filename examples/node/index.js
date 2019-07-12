/* eslint-env node */
const AElf = require('../../dist/aelf.cjs');

const Wallet = AElf.wallet;
const { sha256 } = AElf.utils;

const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';

// const walletCreatedByMethod = Wallet.createNewWallet();
const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);
const aelf = new AElf(new AElf.providers.HttpProvider(
  'http://34.213.112.35:8000',
  null,
  null,
  null,
  [{
    name: 'Accept',
    value: 'text/plain;v=1.0'
  }]
));

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
