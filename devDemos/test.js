var Aelf = require('../lib/aelf.js');
var aelf = new Aelf(new Aelf.providers.HttpProvider("http://localhost:1234/chain"));
// var aelf = new Aelf(new Aelf.providers.HttpProvider("http://192.168.197.33:8000/chain"));
aelf.chain.connectChain();
// var aelf = new Aelf(new Aelf.providers.HttpProvider("http://192.168.197.23:8000/chain"));
// var aelf = new Aelf(new Aelf.providers.HttpProvider("http://172.31.5.155:8000/chain"));

// var tokenc = aelf.chain.getContractAbi('0x75b19ac4415c072512d011634ac86a9c58cf');
// aelf.chain.connectChain(function (err, result) {
//     console.log('connectChain: ', err, result);
// });

// var tokenc = aelf.chain.contractAt('0x75b19ac4415c072512d011634ac86a9c58cf');
var wallet = Aelf.wallet.getWalletByPrivateKey('a26fee9d34f3f81ef939ded709d5b0feb776816dd428d02da0631382d4399db2');
// var wallet = Aelf.wallet.getWalletByPrivateKey('f6e512a3c259e5f9af981d7f99d245aa5bc52fe448495e0b0dd56e8406be6f71');

var tokenc = aelf.chain.contractAt('ELF_29SBBuPHNmZt2bNFcei15Jq5hN5pJdd6Ry48ucHPy5baEwY1RS', wallet);
tokenc.Transfer('ELF_2dDMA8rrSwRBY1MxQVpEHv3YvECfv9WQ5j16rgpZ8usc7sNCUg', 10);

aelf.chain.getBlockHeight();

aelf.chain.getTxsResult('855a15162cf924e3127f8a23d409139c505aee69df37557e5c21db04fe876a3c', 0, 100);

// 获取区块信息1
// 44282 44289
aelf.chain.getBlockInfo(389, true, async (err, result) => {
    // console.log(result.result.Body.Transactions);
    console.log(result);
    console.log('>>>>1>>>>>>');
    console.log(result.result.Body.Transactions);
    let transactions = result.result.Body.Transactions;

    let transactionPromises = [];
    let txLength = transactions.length;
    // Get transactionPromises
    for (let i = 0; i < txLength; i++) {
        transactionPromises.push(new Promise((resolve, reject) => {
            aelf.chain.getTxResult(transactions[i], (error, result) => {

                if (error || !result) {
                    console.log('error result getTxResult: ', listIndex, result, error);
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        }));
    }

    Promise.all(transactionPromises).then(async (result) => {
        console.log('>>>>>2>>>>>');
        console.log('result:', result);
        console.log('>>>>>3>>>>>');
        console.log('result:', result[0].result.tx_info);
    });
});

// 获取区块信息2
aelf.chain.getBlockInfo(9112, true, async (err, result) => {
    console.log(result.result.Body.Transactions);
    console.log(result);
});

// 获取区块信息3
var transations031 = aelf.chain.getTxsResult('5feb4d3175b4144e54f5f4d0a12b19559633a2aede0e87dc42322efe1aac12c9', 0, 100);
// var transations032 = aelf.chain.getTxsResultByBlockhash(
//     '0d0d7dd9dd6fafbc176d900a1d78dc7a1aa2ecebfe72e6d22d2d9c3e84a5ee9d',
//     3,
//     100,
//     function (err, result) {
//         console.log(err, result);
//     }
// );

// 获取交易
aelf.chain.getTxResult('b8d454ad3c9cc0e1d31b0c42d721397211d7430b97377311fc8064261426490d');
aelf.chain.getTxResult('a02c244a3ea340c9095a6336e0ba645e1a37806fffdc5af1e5ecd376f9ba7acc');

// console.log('TokenName: ', tokenc.TokenName());
//
// console.log('BalanceOf: ', tokenc.BalanceOf('0x0424421b90fdacf9470ee049f50113a56656'));

// console.log('Tranfer: ', tokenc.Transfer('70b721ac293f0d3787561828688d860dde4a', 10));

// let contractAbi = aelf.chain.getContractAbi('0xdb458e5db5db1b0ecad3408acc344c96794c');
// console.log('contractAbi: ', contractAbi);
//
// let increment = aelf.chain.getIncrement('0x04bb9c6c297ea90b1bc3e6af2c87d416583e');
// console.log('getIncrement: ', increment);
let totalSupply = tokenc.TotalSupply();
// console.log('totalSupply: ', JSON.stringify(totalSupply));
// let txResult = aelf.chain.getTxResult('0x9e3d580f6e3e09041cb7987dee8c7261237dd6d71812364407fc70971969645e');
// console.log('txResult: ', JSON.stringify(txResult));
//
// console.log('blockHeight: ', aelf.chain.getBlockHeight());

// console.log('getBanceOf start');
// console.log('BalanceOf: ', JSON.stringify(tokenc.BalanceOf('0x04bb9c6c297ea90b1bc3e6af2c87d416583e')));
// console.log('txResult: ', JSON.stringify(aelf.chain.getTxResult('0x9094b098aee097a96445a186f780c1ed5cf3e7628b7f0dcadcefdf2bc6bb3358')));

// tokenc.Initialize('devDemos','hzz',10000,1);


// aelf.chain.sendTransaction({"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0x75b19ac4415c072512d011634ac86a9c58cf","method":"TotalSupply","incr":"2"});
//
// aelf.chain.sendTransaction({"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0x582b198dd8251d2125c8cbbc114c5864d616","method":"TotalSupply","incr":"3"});
// console.log(aelf);
// console.log(tokenc);

// broswer
// var aelf = new Aelf(new Aelf.providers.HttpProvider("http://localhost:8085/aelf/api"));
// aelf.chain.connectChain();
// aelf.chain.getIncrement('0x04bb9c6c297ea90b1bc3e6af2c87d416583e');
// var tokenc = aelf.chain.contractAt('0xdb458e5db5db1b0ecad3408acc344c96794c');
// var response = tokenc.TotalSupply();