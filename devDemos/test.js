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
var proto = require('../lib/aelf/proto');
var wal = require('../lib/aelf/wallet');
var elliptic = require('elliptic');

//var ec = new elliptic.ec('secp256k1');
// var merkletree = require('../lib/utils/merkletree');
// var sha256 = require('js-sha256').sha256;
// var hex1 ='5a7d71da020cae179a0dfe82bd3c967e1573377578f4cc87bc21f74f2556c0ef';
// var hex2 ='a28bf94d0491a234d1e99abc62ed344eb55bb11aeecacc35c1b75bfa85c8983f';
// var hex3 ='bf6ae8809d017f07b27ad1620839c6503666fb55f7fe7ac70881e8864ce5a3ff';
// var hex4 ='bac4adcf8066921237320cdcddb721f5ba5d34065b9c54fe7f9893d8dfe52f17';
// var hex5 ='bac4adcf8066921237320cdcddb721f5ba5d34065b9c54fe7f9893d8dfe52f17';
// var buffer = Buffer.concat([Buffer.from(hex5.replace('0x', ''), 'hex'), Buffer.from('Mined', 'utf8')]);
// var buffers = [
//     Buffer.from(hex1.replace('0x', ''), 'hex'),
//     Buffer.from(hex2.replace('0x', ''), 'hex'),
//     Buffer.from(hex3.replace('0x', ''), 'hex'),
//     Buffer.from(hex4.replace('0x', ''), 'hex'),
//     Buffer.from(sha256(buffer), 'hex')
// ];
// var path = merkletree.getMerklePath(4, buffers);
// console.log(path.length);
// path.forEach(function (node) {
//    console.log(node.toString('hex'));
// });

var wallet = wal.getWalletByPrivateKey('21a455ab2714e706ff390576c2685787e3620863dd6fbc803a469510cc1d05b4');
//var aelf = new Aelf(new Aelf.providers.HttpProvider("http://localhost:1234/chain"));
// var aelf = new Aelf(new Aelf.providers.HttpProvider("http://192.168.199.210:5000/chain"));
var aelf = new Aelf(new Aelf.providers.HttpProvider("http://localhost:8000/chain"));
aelf.chain.getChainInformation();
var contractZero = aelf.chain.contractAt('61W3AF3Voud7cLY2mejzRuZ4WEN8mrDMioA9kZv3H8taKxF', wallet);
var tokenSystemName = sha256(Buffer.from('AElf.ContractNames.Token', 'utf8'));


var tokenContract = aelf.chain.contractAt('4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc', wallet);
//tokenContract.Issue(            'ELF', 1000000, 'ELF token', '2ttnmC14FcoLe8dgwsJBSHYH5mgT5uwa6bbyG4HQeinKX4E');
var crossChainContract = aelf.chain.contractAt('2ErQEpj6v63LRSBwijZkHQVkRt1JH6P5Tuz6a6Jzg5DDiDF', wallet);
tokenContract.GetBalance({'symbol': 'ELF', 'owner' : '569JPjr9hSrzJFdEqQCpHtEsakM61MsgDBjoU4Fkm9GSSLV'});
//tokenContract.Initialize('ELF', 'ELF Token', 100000, 0);
var sideChainInfo = {
    'IndexingPrice' : 1,
    'LockedTokenAmount' : 2000,
    'ResourceBalances' : [{"Type":"CPU","Amount":1},{"Type":"Ram","Amount":1},{"Type":"Net","Amount":1}],
    'Proposer' : '569JPjr9hSrzJFdEqQCpHtEsakM61MsgDBjoU4Fkm9GSSLV',
    'ContractCode' : '4d5a90000300'
};

tokenContract.Approve({'symbol':'ELF', 'amount': 10000, 'spender':'2ErQEpj6v63LRSBwijZkHQVkRt1JH6P5Tuz6a6Jzg5DDiDF'});
crossChainContract.RequestChainCreation(sideChainInfo);
crossChainContract.CreateSideChain({'Value':2750978});
crossChainContract.CreateSideChain({'Value':2816514});
var main_height =52;
var merklePath_main_chain = aelf.chain.getMerklePath('b3d2da4313c0ce469a63ec8bce4daa467335005a28f98c37b27ddb6b08e352ab', main_height);
merklePath_main_chain.forEach(function (path) {
    console.log(path.toString('hex'));
});
var verificationInput_main_chain ={
    'transactionId' : 'b3d2da4313c0ce469a63ec8bce4daa467335005a28f98c37b27ddb6b08e352ab',
    'path' : ['8ac04a2022fa63942a2f5cf23fad1e162a11841bfe3e9fcda194c9dae0758ea5'],
    'parentChainHeight' : main_height,
    'verifiedChainId' : 9992731
};





var aelf_side1 = new Aelf(new Aelf.providers.HttpProvider("http://localhost:8010/chain"));
// var merklePath = aelf_side1.chain.getMerklePath('72f03ec78a650f7160a6242710a4a16a27fb1dbab321e241ffbd83f00fe5e60c', 20);
// merklePath.forEach(function (path) {
//     console.log(path.toString('hex'));
// });

var wallet1 = wal.getWalletByPrivateKey('7c2627b14e41b7aa2998c1125b9a9b74f682a45438cf4c8566a9ec0465a00a7f');
var crosschainContract_side1 = aelf_side1.chain.contractAt('xAepYRxjU5pQPVdjzR59ntKouVH4heaKddQJLdpBQMTtJR', wallet1);
crosschainContract_side1.GetBoundParentChainHeightAndMerklePathByHeight({'Value':20});
var parent_height = 52;
var verificationInput ={
    'transactionId' : '8b9d3a1f8497233df41b942f7184c59d54292720938a7428f0c20ff0696c0922',
    'path' : ['18aa01396b3035748a9f564c979d028593879a8f0aa070cd6a28f662b37b0a85', '2185b6c486e79be38cf2e823d1b7dfaf9965035f0b80be2501f283296011c6a3', 'a50ffd2e03f0b36add6dbeeeed3f1a8921e7a2d6c2a76a8f78bf81a88fd2ddc5'],
    'parentChainHeight' : parent_height,
    'verifiedChainId' : 2816514
};
crosschainContract_side1.VerifyTransaction(verificationInput);

var side_1_height = 241;
var merklePath_side_chain_1 = aelf_side1.chain.getMerklePath('9aca860bffefd27f5d923162a3a4b40992081f5dcfd4f765150a4144d761af41', side_1_height);
merklePath_side_chain_1.forEach(function (path) {
    console.log(path.toString('hex'));
});
crosschainContract_side1.GetBoundParentChainHeightAndMerklePathByHeight({'Value': side_1_height});

var verificationInput_side_chain_1 = {
    'transactionId' : '9aca860bffefd27f5d923162a3a4b40992081f5dcfd4f765150a4144d761af41',
    'path' : ['a87273725e0aa50abe9adec84f91d70d429bb4b868d90f22c5c9daf6d02b5d87', '54552e12299003e6885751442576d37a20c95e7c897e3618f8c0800f937c8d68', 'fc2bc07a2e66414effe71764efa0326a9c354201c1684c7addc8542453efdb46'],
    'parentChainHeight' : 272,
    'verifiedChainId' : 2750978
};
crossChainContract.VerifyTransaction(verificationInput_side_chain_1);

crosschainContract_side1.VerifyTransaction(verificationInput_side_chain_1);


var contractZero_side1 = aelf_side1.chain.contractAt('4Vsgwe6NeHDVkRkGqgMWv2fXt3GYF71ncWDFKHaMaA4iDJ7', wallet1);
contractZero_side1.GetContractAddressByName({"Value": Buffer.from(tokenSystemName, 'hex')});
var tokenContract_side1 = aelf_side1.chain.contractAt('6NRUWAMzAv2hFNwEfSKqnihQ1XSw2KKJAyZfXG1cr3b9T6n', wallet1);

var txInHex ='0a200a1e53d0161d3dcfcc68ee03595afdecba5f815176a642fac8a9c1dc37f571c312200a1e8f327b198e6a1f5f4bde148f006966553b0298d7c694852676103fe17af218102204656f335a321243726f7373436861696e5472616e736665723a2e0a200a1e53d0161d3dcfcc68ee03595afdecba5f815176a642fac8a9c1dc37f571c31203454c46181e2882f4a7014a4127e5e6ff1b9fa8bbc5fdd2c65a545bf43b0c139319cb7c0be3c0181189bfb9e95acb7ce819233de73be57059383ac58eb027620a88c54e30c4a75ddcf5ec42ad01';
var bytes = Buffer.from(txInHex, 'hex');

var crossChainReceiveInPut = {
    'fromChainId' : 2816514,
    'parentChainHeight' : parent_height,
    'transferTransactionBytes': bytes,
    'merklePath' : ['18aa01396b3035748a9f564c979d028593879a8f0aa070cd6a28f662b37b0a85', '2185b6c486e79be38cf2e823d1b7dfaf9965035f0b80be2501f283296011c6a3', 'a50ffd2e03f0b36add6dbeeeed3f1a8921e7a2d6c2a76a8f78bf81a88fd2ddc5'],
};
tokenContract_side1.CrossChainReceiveToken(crossChainReceiveInPut);
tokenContract_side1.GetBalance({'symbol': 'ELF', 'owner' : '2ttnmC14FcoLe8dgwsJBSHYH5mgT5uwa6bbyG4HQeinKX4E'});





var aelf_side2 = new Aelf(new Aelf.providers.HttpProvider("http://localhost:8020/chain"));
aelf_side2.chain.GetChainInformation();

var wallet2 = wal.getWalletByPrivateKey('7c2627b14e41b7aa2998c1125b9a9b74f682a45438cf4c8566a9ec0465a00a7f');
var contractZero_side2 = aelf_side2.chain.contractAt('6Jqy3Yr5HfPLEydQ45xbnmzBzcfGLHMkN3GJb5ccHTuuhvo', wallet2);
contractZero_side2.GetContractAddressByName({"Value": Buffer.from(tokenSystemName, 'hex')});
var crossChainSystemName = sha256(Buffer.from('AElf.ContractNames.CrossChain', 'utf8'));
contractZero_side2.GetContractAddressByName({"Value": Buffer.from(crossChainSystemName, 'hex')});
var crossChainContract_side2 =aelf_side2.chain.contractAt('6Qib5QjEKhnkrSEc4mzq5VH4jEpxeZbr1EmH3UMJhkbp5wd', wallet2);
var tokenContract_side2 = aelf_side2.chain.contractAt('4EkqvQBy99QHySsUVbvx5uJaMyPvMjizLxWF66zWTtDzJL1', wallet2);

var height = 17;
var merklePath2 = aelf_side2.chain.getMerklePath('8b9d3a1f8497233df41b942f7184c59d54292720938a7428f0c20ff0696c0922', height);
merklePath2.forEach(function (path) {
    console.log(path.toString('hex'));
});

crossChainContract_side2.GetBoundParentChainHeightAndMerklePathByHeight({'Value':height});

var crossChainTransferInput = {
    'to' : '2ttnmC14FcoLe8dgwsJBSHYH5mgT5uwa6bbyG4HQeinKX4E',
    'symbol' : 'ELF',
    'amount' : 15,
    'toChainId' : 2750978
};

tokenContract_side2.CrossChainTransfer(crossChainTransferInput);
tokenContract_side2.GetBalance({'symbol': 'ELF', 'owner' : '2ttnmC14FcoLe8dgwsJBSHYH5mgT5uwa6bbyG4HQeinKX4E'});

// var Aelf = require('../lib/aelf.js');
// var aelf = new Aelf(new Aelf.providers.HttpProvider("http://localhost:8000/chain"));
// var multitoken_contract = aelf.chain.contractAt();
//
// var merklePath = aelf.chain.getMerklePath('3f282c36fd4631d084e1959b0674085067b4a693c5cc5db9d5728642f92aca73', 500);
// console.log('path size', merklePath.length);
// merklePath.forEach(function (path) {
//     console.log(path.toString('hex'));
// });
// aelf.chain.getChainInformation();
// aelf.chain.getBlockInfo(500, true);
//
// // just to get chain information; we can use aelf.chain[methods] without aelf.chain.connectChain();
// // Or we can use connectChain to check network... 233
// aelf.chain.connectChain((err, result) => {console.log(err, result);});
// // var tokenc = aelf.chain.getContractAbi('0x75b19ac4415c072512d011634ac86a9c58cf');
// // aelf.chain.connectChain(function (err, result) {
// //     console.log('connectChain: ', err, result);
// // });
//
// // var tokenc = aelf.chain.contractAt('ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9', wallet);
//
// var resourceC = aelf.chain.contractAt('ELF_4CBbRKd6rkCzTX5aJ2mnGrwJiHLmGdJZinoaVfMvScTEoBR', wallet);
// // var wallet = Aelf.wallet.getWalletByPrivateKey('f6e512a3c259e5f9af981d7f99d245aa5bc52fe448495e0b0dd56e8406be6f71');
// aelf.chain.contractAt('ELF_47dpXA3aEuDj9yeq9Et2E4zjPrSs4uQpzdFkYuBZEEQmob');
// var tokenc = aelf.chain.contractAt('ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx', wallet);
// // var contract = aelf.chain.contractAt('ELF_hQZE5kPUVH8BtVMvKfLVMYeNRYE1xB2RzQVn1E5j5zwb9t', wallet);
// // contract.InitialBalance('ELF_69CLYuVBrL4oosw97zvE2kcMsddN5k7twQjC56uTFY9dU14', 100000000);
// // InitalBalance 交易id 5a7d71da020cae179a0dfe82bd3c967e1573377578f4cc87bc21f74f2556c0ef
// tokenc.Transfer('ELF_69CLYuVBrL4oosw97zvE2kcMsddN5k7twQjC56uTFY9dU14', 10);
//
// // 获取区块信息1
// // 44282 44289
// aelf.chain.getBlockInfo(472, true, async (err, result) => {
//     // console.log(result.result.Body.Transactions);
//     console.log(result);
//     console.log('>>>>1>>>>>>');
//     console.log(result.result.Body.Transactions);
//     let transactions = result.result.Body.Transactions;
//
//     let transactionPromises = [];
//     let txLength = transactions.length;
//     // Get transactionPromises
//     for (let i = 0; i < txLength; i++) {
//         transactionPromises.push(new Promise((resolve, reject) => {
//             aelf.chain.getTxResult(transactions[i], (error, result) => {
//
//                 if (error || !result) {
//                     console.log('error result getTxResult: ', listIndex, result, error);
//                     reject(error);
//                 } else {
//                     resolve(result);
//                 }
//             });
//         }));
//     }
//
//     Promise.all(transactionPromises).then(async (result) => {
//         console.log('>>>>>2>>>>>');
//         console.log('result:', result);
//         console.log('>>>>>3>>>>>');
//         console.log('result:', result[0].result.tx_info);
//     });
// });
//
// // 获取区块信息2
// aelf.chain.getBlockInfo(472, true, async (err, result) => {
//     console.log(result.result.Body.Transactions);
//     console.log(result);
// });
//
// // 获取区块信息3
// var transations031 = aelf.chain.getTxsResult('5feb4d3175b4144e54f5f4d0a12b19559633a2aede0e87dc42322efe1aac12c9', 0, 100);
//
// // var transations032 = aelf.chain.getTxsResultByBlockhash(
// //     '0d0d7dd9dd6fafbc176d900a1d78dc7a1aa2ecebfe72e6d22d2d9c3e84a5ee9d',
// //     3,
// //     100,
// //     function (err, result) {
// //         console.log(err, result);
// //     }
// // );
//
// // 获取交易
// aelf.chain.getTxResult('a97b2eaf8bed71345c3d87df62eaa89262d0a53eeda30fb81515ea4eb346542c', (error, result) => {
//     console.log('getTxResult: ', error, result);
// });
// // console.log('TokenName: ', tokenc.TokenName());
// tokenc.BalanceOf('ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB');
// //
// // console.log('BalanceOf: ', tokenc.BalanceOf('0x0424421b90fdacf9470ee049f50113a56656'));
//
// // console.log('Tranfer: ', tokenc.Transfer('70b721ac293f0d3787561828688d860dde4a', 10));
//
// // let contractAbi = aelf.chain.getContractAbi('0xdb458e5db5db1b0ecad3408acc344c96794c');
// // console.log('contractAbi: ', contractAbi);
// //
// // let increment = aelf.chain.getIncrement('0x04bb9c6c297ea90b1bc3e6af2c87d416583e');
// // console.log('getIncrement: ', increment);
// let totalSupply = tokenc.TotalSupply();
// // console.log('totalSupply: ', JSON.stringify(totalSupply));
// // let txResult = aelf.chain.getTxResult('0x9e3d580f6e3e09041cb7987dee8c7261237dd6d71812364407fc70971969645e');
// // console.log('txResult: ', JSON.stringify(txResult));
// //
// // console.log('blockHeight: ', aelf.chain.getBlockHeight());
//
// // console.log('getBanceOf start');
// // console.log('BalanceOf: ', JSON.stringify(tokenc.BalanceOf('0x04bb9c6c297ea90b1bc3e6af2c87d416583e')));
// // console.log('txResult: ', JSON.stringify(aelf.chain.getTxResult('0x9094b098aee097a96445a186f780c1ed5cf3e7628b7f0dcadcefdf2bc6bb3358')));
//
// // tokenc.Initialize('devDemos','hzz',10000,1);
//
//
// // aelf.chain.sendTransaction({"from":"ELF_4yCJfobjm2YAdxGrwACQihpa3TMz1prDTdYiWTvFTvefQFs","to":"ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx","method":"TotalSupply","incr":"2"});
// //
// // aelf.chain.sendTransaction({"from":"0x0489da3cad42c556cddf672d6719c8add3ac","to":"0x582b198dd8251d2125c8cbbc114c5864d616","method":"TotalSupply","incr":"3"});
// // console.log(aelf);
// // console.log(tokenc);
//
// // broswer
// // var aelf = new Aelf(new Aelf.providers.HttpProvider("http://localhost:8085/aelf/api"));
// // aelf.chain.connectChain();
// // aelf.chain.getIncrement('0x04bb9c6c297ea90b1bc3e6af2c87d416583e');
// // var tokenc = aelf.chain.contractAt('0xdb458e5db5db1b0ecad3408acc344c96794c');
// // var response = tokenc.TotalSupply();
//
// console.log('address - ', wallet.address);
// var rawTxn = proto.getTransaction('ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9', 'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9', 'test', []);
// var txn = Aelf.wallet.signTransaction(rawTxn, wallet.keyPair);
// var sig = txn.Sigs[0];
// console.log('sig length - ', sig.length);
// console.log('sig - ', sig.toString('hex'));
// // console.log('sigObj.s - ', sigObj.s.toString('hex'));
// // console.log('sigObj.s length - ', sigObj.s.toArray().length);
// //
// // console.log('sigObj.r - ', sigObj.r.toString('hex'));
// // console.log('sigObj.r length - ', sigObj.r.toArray().length);
// // console.log('sigObj.recoveryParam - ', sigObj.recoveryParam);
// rawTxn.Sigs =[];
// var ser = proto.Transaction.encode(rawTxn).finish();
// var msgHash = sha256(ser);
// var r = sig.slice(0, 32);
// var s = sig.slice(32, 64);
// var sigObj = { r: r, s: s, recoveryParam: sig.readInt8(sig.length - 1) };
// console.log('sigObj.r - ', sigObj.r.toString('hex'));
// console.log('sigObj.r length - ', sigObj.r.length);
//
// console.log('sigObj.s - ', sigObj.s.toString('hex'));
// console.log('sigObj.s length - ', sigObj.s.length);
//
// console.log('sigObj.recoveryParam - ', sigObj.recoveryParam);
// console.log('message - ', msgHash);
// var pubkey = ec.recoverPubKey(Buffer.from(msgHash, "hex"), sigObj, sig.readInt8(sig.length - 1));
// console.log('pubkey - ', pubkey.encode("hex"));
// var res = ec.verify(Buffer.from(msgHash, "hex"), sigObj, pubkey);
//console.log(res);