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
// 286izE4MsFWdGZn2xCcPSBaRqwXFB95xu5Urfki3q5xmmCc
const privateKey = '097fc2e1eea2bfe258e7962c644f6d87ac58bfbd80301e10740baf52f45141c1';
// tell laugh gym apart occur ship shine armed spare erupt hope pull
// address: rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v
// privateKey: f03dbc454f97c61b91dbbe70fbd7c96a6527dd01378423130d5e2f42bc33676b

const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);

const aelf = new AElf(new AElf.providers.HttpProvider(
    // 'http://192.168.197.56:8101/chain',
    // 'http://34.212.171.27:8000/chain',
    // 'http://54.149.84.199:8000/chain',
    // 'http://103.61.37.19:8000/chain',
    // 'http://34.213.112.35:8000/chain',
    'http://127.0.0.1:8000/chain',
    // http://47.74.219.55:1728
    // 'http://47.74.219.55:1728/chain',
    // 'http://192.168.197.56:8101/chain',
    null,
    null,
    null,
    [{
        name: 'Accept',
        value: 'text/plain;v=1.0'
    }]
));

// For Test
const tokenC = aelf.chain.contractAt('WnV9Gv3gioSh3Vgaw8SSB96nV8fWUNxuVozCf6Y14e7RXyGaM', wallet);

// ////////////////////////////////////////////
// sendTransaction 的三种调用方式 start
// ////////////////////////////////////////////
// Default return promise
tokenC.Transfer({
    symbol: 'BTC',
    to: 'rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v',
    amount: 100,
    memo: 'yeah'
});

// ugly sync
tokenC.Transfer({
    symbol: 'BTC',
    to: 'rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v',
    amount: 100,
    memo: 'yeah'
}, {
    sync: true
});

// ugly callback
tokenC.Transfer({
    symbol: 'BTC',
    to: 'rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v',
    amount: 100,
    memo: 'yeah'
}, (error, result) => {
    console.log(error, result);
});

// promise case
tokenC.Transfer({
    symbol: 'BTC',
    to: 'rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v',
    amount: 100,
    memo: 'yeah'
}).then(result => {
    console.log('then: ', result);
}).catch(error => {
    console.log('error', error);
});

async function testPromise() {
    const tokenInfo = await tokenC.Transfer({
        symbol: 'BTC',
        to: 'rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v',
        amount: 100,
        memo: 'yeah'
    });
    console.log('tokenInfo: ', tokenInfo);
}
testPromise();


// ////////////////////////////////////////////
// sendTransaction 的三种调用方式 end
// ////////////////////////////////////////////

// ////////////////////////////////////////////
// call 的三种调用方式 start
// ////////////////////////////////////////////
// 没有设置，默认返回promise
tokenC.GetTokenInfo.call({
    symbol: 'ELF'
});

// ugly，使用同步请求
tokenC.GetTokenInfo.call({
    symbol: 'ELF'
}, {
    sync: true
});

// callback模式
tokenC.GetTokenInfo.call({
    symbol: 'ELF'
}, (error, result) => {
    console.log('callback: ', error ,result);
});

tokenC.GetTokenInfo.call({
    symbol: 'ELF'
}).then(result => {
    console.log('then: ', result);
}).catch(error => {
    console.log('error', error);
});

async function testPromise() {
    const tokenInfo = await tokenC.GetTokenInfo.call({
        symbol: 'ELF'
    });
    console.log('tokenInfo: ', tokenInfo);
}
testPromise();
// ////////////////////////////////////////////
// call 的三种调用方式 end
// ////////////////////////////////////////////

tokenC.GetBalance.call({
    symbol: 'BTC',
    owner: 'rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v'
    // owner: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX'
});

tokenC.Transfer({
    symbol: 'BTC',
    to: 'rkws1GibTwWQnLyLvpRtnDQiZYf51tEqQDwpGaou5s4ZQvi1v',
    amount: 100,
    memo: 'yeah'
});

return;

const {
    GenesisContractAddress
} = aelf.chain.getChainStatus();

const zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet);
// aelf.chain.contractAtAsync(GenesisContractAddress, wallet, (err, result) => {
//     let test = 1;
//     console.log(err, result, test);
// });

// // zeroC.GetContractAddressByName('AElf.ContractNames.Consensus'); // HelloWorldContract
const tokenContractAddress = zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Token')); // HelloWorldContract
// // zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.Token')); // HelloWorldContract
// // const tokenContractAddress = zeroC.GetContractAddressByName.call(sha256('AElf.ContractNames.TokenConverter')); // HelloWorldContract
// // const tokenContractAddress = zeroC.GetContractAddressByName.call(sha256('TokenConverterContract')); // HelloWorldContract

// // const tokenC = aelf.chain.contractAt(tokenContractAddress, wallet);
// const tokenC = aelf.chain.contractAt(tokenContractAddress, wallet);
// // const tokenCAsync = 
// // aelf.chain.contractAtAsync(tokenContractAddress, wallet).then(result => {
// //     console.log(result);
// // }).catch(error => {
// //     console.log('error: ', error);
// // });

// // 1
// tokenC.GetTokenInfo.call({
//     symbol: 'ELF'
// });
// // 2
// tokenC.GetTokenInfo.call({
//     symbol: 'ELF'
// }, (err, result) => {
//     console.log(err, result);
// });
// // 3
// tokenC.GetTokenInfo.call({
//     symbol: 'ELF'
// }).then((error, result) => {
//     console.log(error, result);
// });

tokenC.GetBalance.call({
    symbol: 'ELF',
    // owner: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX'
    owner: '28Y8JA1i2cN6oHvdv7EraXJr9a1gY6D1PpJXw9QtRMRwKcBQMK'
    // owner: '2gaQh4uxg6tzyH1ADLoDxvHA14FMpzEiMqsQ6sDG5iHT8cmjp8'
});

tokenC.Tranfer({
    symbol: 'ELF',
    amount: 1000,
    // owner: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX'
    to: '28Y8JA1i2cN6oHvdv7EraXJr9a1gY6D1PpJXw9QtRMRwKcBQMK'
    // owner: '2gaQh4uxg6tzyH1ADLoDxvHA14FMpzEiMqsQ6sDG5iHT8cmjp8'
});

// tokenC.GetBalance.call({
//     symbol: 'ELF',
//     owner: '28Y8JA1i2cN6oHvdv7EraXJr9a1gY6D1PpJXw9QtRMRwKcBQMK'
// }, (error, result) => {
//     console.log('balance: ', error, result);
// });

// // 如何自己发一个币
// tokenC.Create({
//     symbol: 'BTC',
//     tokenName: 'BTC',
//     totalSupply: 100000,
//     decimals: 10,
//     issuer: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX',
//     isBurnable: true
// });
// // txid: 3c94e12283e598174dd3906c17435d8dc3713b31f71a0467e247ea48c08f279a
// // blockHeight: 16681
// tokenC.Issue({
//     symbol: 'BTC',
//     amount: 10000,
//     memo: 'yeah',
//     to: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX'
// });

// tokenC.GetBalance.call({
//     symbol: 'BTC',
//     owner: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX'
// }, (error, result) => {
//     console.log('balance: ', error, result);
// });

// console.log(zeroC.GetContractAddressByName(sha256('HelloWorldContract'))); // HelloWorldContract
// // 679ecba22edfcb0eb1e5f5b249eaea53cee1034278aa42b987d7311e51eff564
// // 15aab24ec3ac12b101abf404a96ba603208631760e3eb51a1ddc18d185941b9c
// // 5jszzRvXNTUj3ctzo4VnLtFSUH7fp4aHLXQQyBRPQdzw5Fw
// const nameHashed = sha256('AElf.ContractNames.CrossChain');
// zeroC.GetContractAddressByName.call(nameHashed);
