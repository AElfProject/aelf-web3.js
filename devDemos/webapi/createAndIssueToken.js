/**
 * @file getContractAddressByName.js
 * @author huangzongzhe
 */

/* eslint-disable fecs-camelcase */
const AElf = require('../../lib/aelf.js');
const Wallet = AElf.wallet;
const sha256 = AElf.utils.sha256;
// address: 2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX
const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';
// address: 2PWYbaiJkfgUcP3zVEKuuPejz4QiBJoZpFy7LkMHnxukggZYE7
const privateKey = '097fc2e1eea2bfe258e7962c644f6d87ac58bfbd80301e10740baf52f45141c1';

const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);

const aelf = new AElf(new AElf.providers.HttpProvider(
    // 'http://192.168.197.56:8101/chain',
    // 'http://34.212.171.27:8000/chain',
    'http://192.168.197.56:8101/chain',
    null,
    null,
    null,
    [{
        name: 'Accept',
        value: 'text/plain;v=1.0'
    }]
));

const {
    GenesisContractAddress
} = aelf.chain.getChainStatus();

const zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet);

// zeroC.GetContractAddressByName('AElf.ContractNames.Consensus'); // HelloWorldContract
const tokenContractAddress = zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Token')); // HelloWorldContract

const tokenC = aelf.chain.contractAt(tokenContractAddress, wallet);

tokenC.Create({
    symbol: 'QLLA',
    tokenName: 'QLLA',
    totalSupply: 100000000,
    decimals: 2,
    issuer: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX',
    isBurnable: true
});

tokenC.GetTokenInfo.call({
    symbol: 'QLLA'
});

tokenC.GetBalance.call({
    symbol: 'QLLA',
    owner: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX'
});

tokenC.Issue({
    symbol: 'QLLA',
    amount: 700700,
    memo: 'Issue',
    to: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX'
});

tokenC.Transfer({
    to: '2PWYbaiJkfgUcP3zVEKuuPejz4QiBJoZpFy7LkMHnxukggZYE7',
    symbol: 'QLLA',
    amount: 700,
    memo: 'hzz780'
});
