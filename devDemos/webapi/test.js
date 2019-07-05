/**
 * @file test.js
 * @author huangzongzhe
 * @description
 * Test the sdk.
 */

/* eslint-disable fecs-camelcase */
const AElf = require('../../lib/aelf.js');
const Wallet = AElf.wallet;
const sha256 = AElf.utils.sha256;
// address: 2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX
const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';
// 286izE4MsFWdGZn2xCcPSBaRqwXFB95xu5Urfki3q5xmmCc
const privateKey = '097fc2e1eea2bfe258e7962c644f6d87ac58bfbd80301e10740baf52f45141c1';
// tell laugh gym apart occur ship shine armed spare erupt hope pull
// address: rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v
// privateKey: f03dbc454f97c61b91dbbe70fbd7c96a6527dd01378423130d5e2f42bc33676b

const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);

const aelf = new AElf(new AElf.providers.HttpProvider(
    // 'http://127.0.0.1:8000'
    'http://103.61.37.19:8000'
));

console.log('isConnected: ', aelf.isConnected());
console.log('----------------------------');

let {
    GenesisContractAddress
} = aelf.chain.getChainStatus({
    sync: true
});

let zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet);
// aelf.chain.contractAtAsync(GenesisContractAddress, wallet, (err, result) => {
//     let test = 1;
//     console.log(err, result, test);
// });

// zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Consensus'), {sync: true}); // HelloWorldContract
let tokenContractAddress = zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Token'), {
    sync: true
});
// For Test
// let tokenC = aelf.chain.contractAt('WnV9Gv3gioSh3Vgaw8SSB96nV8fWUNxuVozCf6Y14e7RXyGaM', wallet);
let tokenC = aelf.chain.contractAt(tokenContractAddress, wallet);

let txId = tokenC.Transfer({
    symbol: 'BTC',
    to: 'rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v',
    amount: 1,
    memo: 'yeah'
}, {
    sync: true
});

console.log('txid: ', txId);
console.log('----------------------------');
// aelf.chain.getTxResult(txId.TransactionId, {sync: true});
console.log('txid: result', aelf.chain.getTxResult(txId.TransactionId, {sync: true}));
console.log('----------------------------');

tokenC.GetTokenInfo.call({
    symbol: 'ELF'
}, (error, result) => {
    console.log('callback: ', error, result);
    console.log('----------------------------');
});

tokenC.GetTokenInfo.call({
    symbol: 'ELF'
}, {sync: true});

// tokenC.GetBalance.call({
//     symbol: 'BTC',
//     owner: 'rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v'
//     // owner: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX'
// }).then(result => {
//     console.log('GetBalance:', result);
//     console.log('----------------------------');
// });

