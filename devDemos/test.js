/**
 * 调用合约方法就是调用broadcast_tx
 * 签名处理前的rawtx:
   var txn = {
        "From": getAddressFromRep(from),
        "To": getAddressFromRep(to),
        "MethodName": methodName,
        "Params": params,
        "Time" : {
            seconds: Math.floor(parsedTime/1000),
            // this nanos is Microsecond
            nanos: (parsedTime % 1000) * 1000
        }
    };
 * {"jsonrpc":"2.0","id":8,"method":"broadcast_tx","params":{"rawtx":"xxx"}}
 */

var Aelf = require('../lib/aelf.js');

var sha256 = require('js-sha256').sha256;
var proto = require('../lib/aelf/proto');
var wal = require('../lib/aelf/wallet');
var elliptic = require('elliptic');
var ec = new elliptic.ec('secp256k1');
var wallet = wal.getWalletByPrivateKey('bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b');
var aelf = new Aelf(new Aelf.providers.HttpProvider("http://localhost:1234/chain"));
// var aelf = new Aelf(new Aelf.providers.HttpProvider("http://192.168.199.210:5000/chain"));
aelf.chain.connectChain();

// var aelf = new Aelf(new Aelf.providers.HttpProvider("http://localhost:1234/chain"));
// var aelf = new Aelf(new Aelf.providers.HttpProvider("http://192.168.197.70:8001/chain"));

// var aelf = new Aelf(new Aelf.providers.HttpProvider("http://192.168.197.23:8000/chain"));
var aelf = new Aelf(new Aelf.providers.HttpProvider("http://localhost:8001/chain"));

// just to get chain information; we can use aelf.chain[methods] without aelf.chain.connectChain();
// Or we can use connectChain to check network... 233
aelf.chain.connectChain((err, result) => {console.log(err, result);});
// var tokenc = aelf.chain.getContractAbi('0x75b19ac4415c072512d011634ac86a9c58cf');
// aelf.chain.connectChain(function (err, result) {
//     console.log('connectChain: ', err, result);
// });

// var tokenc = aelf.chain.contractAt('0x75b19ac4415c072512d011634ac86a9c58cf');

var wallet = Aelf.wallet.getWalletByPrivateKey('0d61b93aa158ee0c7c8876d642689ef6f3663bfb382da1061176a3c6ce89e79b');
var resourceC = aelf.chain.contractAt('ELF_47dpXA3aEuDj9yeq9Et2E4zjPrSs4uQpzdFkYuBZEEQmob', wallet);
// var wallet = Aelf.wallet.getWalletByPrivateKey('f6e512a3c259e5f9af981d7f99d245aa5bc52fe448495e0b0dd56e8406be6f71');
aelf.chain.contractAt('ELF_47dpXA3aEuDj9yeq9Et2E4zjPrSs4uQpzdFkYuBZEEQmob');
var tokenc = aelf.chain.contractAt('ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx', wallet);
// var contract = aelf.chain.contractAt('ELF_hQZE5kPUVH8BtVMvKfLVMYeNRYE1xB2RzQVn1E5j5zwb9t', wallet);
// contract.InitialBalance('ELF_69CLYuVBrL4oosw97zvE2kcMsddN5k7twQjC56uTFY9dU14', 100000000);
// InitalBalance 交易id 5a7d71da020cae179a0dfe82bd3c967e1573377578f4cc87bc21f74f2556c0ef
tokenc.Transfer('ELF_69CLYuVBrL4oosw97zvE2kcMsddN5k7twQjC56uTFY9dU14', 10);

aelf.chain.getBlockHeight();

aelf.chain.getTxsResult('5a7d71da020cae179a0dfe82bd3c967e1573377578f4cc87bc21f74f2556c0ef', 0, 100);

// 获取区块信息1
// 44282 44289
aelf.chain.getBlockInfo(472, true, async (err, result) => {
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
aelf.chain.getBlockInfo(472, true, async (err, result) => {
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
aelf.chain.getTxResult('a97b2eaf8bed71345c3d87df62eaa89262d0a53eeda30fb81515ea4eb346542c', (error, result) => {
    console.log('getTxResult: ', error, result);
});
// console.log('TokenName: ', tokenc.TokenName());
tokenc.BalanceOf('ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB');
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


// aelf.chain.sendTransaction({"from":"ELF_4yCJfobjm2YAdxGrwACQihpa3TMz1prDTdYiWTvFTvefQFs","to":"ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx","method":"TotalSupply","incr":"2"});
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

console.log('address - ', wallet.address);
var rawTxn = proto.getTransaction('ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9', 'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9', 'test', []);
var txn = Aelf.wallet.signTransaction(rawTxn, wallet.keyPair);
var sig = txn.Sigs[0];
console.log('sig length - ', sig.length);
console.log('sig - ', sig.toString('hex'));
// console.log('sigObj.s - ', sigObj.s.toString('hex'));
// console.log('sigObj.s length - ', sigObj.s.toArray().length);
//
// console.log('sigObj.r - ', sigObj.r.toString('hex'));
// console.log('sigObj.r length - ', sigObj.r.toArray().length);
// console.log('sigObj.recoveryParam - ', sigObj.recoveryParam);
rawTxn.Sigs =[];
var ser = proto.Transaction.encode(rawTxn).finish();
var msgHash = sha256(ser);
var r = sig.slice(0, 32);
var s = sig.slice(32, 64);
var sigObj = { r: r, s: s, recoveryParam: sig.readInt8(sig.length - 1) };
console.log('sigObj.r - ', sigObj.r.toString('hex'));
console.log('sigObj.r length - ', sigObj.r.length);

console.log('sigObj.s - ', sigObj.s.toString('hex'));
console.log('sigObj.s length - ', sigObj.s.length);

console.log('sigObj.recoveryParam - ', sigObj.recoveryParam);
console.log('message - ', msgHash);
var pubkey = ec.recoverPubKey(Buffer.from(msgHash, "hex"), sigObj, sig.readInt8(sig.length - 1));
console.log('pubkey - ', pubkey.encode("hex"));
var res = ec.verify(Buffer.from(msgHash, "hex"), sigObj, pubkey);
console.log(res);