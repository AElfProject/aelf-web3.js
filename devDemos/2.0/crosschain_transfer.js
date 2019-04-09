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
var sha256 = require('js-sha256').sha256;

//var ec = new elliptic.ec('secp256k1');
// var merkletree = require('../lib/utils/merkletree');
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

tokenContract.GetTokenInfo({'symbol': 'ELF'});
var tokenInfo ={ 'symbol': 'ELF', 'tokenName': 'elf token', 'supply': 1000000000, 'totalSupply': 1000000000, 'decimals': 2, 'issuer': '61W3AF3Voud7cLY2mejzRuZ4WEN8mrDMioA9kZv3H8taKxF', 'isBurnable': true }

var crossChainTransferInput_main_chain = {
    'to' : '2ttnmC14FcoLe8dgwsJBSHYH5mgT5uwa6bbyG4HQeinKX4E',
    'tokenInfo' : tokenInfo,
    'amount' : 100,
    'toChainId' : 2750978
};
tokenContract.CrossChainTransfer(crossChainTransferInput_main_chain);


var main_height = 64;
var merklePath_main_chain = aelf.chain.getMerklePath('58dd8bee7435c0942ef0cbf8986001baf03db931f8d237f2b9de1e602f2c5df4', main_height);
merklePath_main_chain.forEach(function (path) {
    console.log(path.toString('hex'));
});
var verificationInput_main_chain ={
    'transactionId' : '56ffd8f727eaf588fffe72aa4534ca4b34cfe8cc086f8023f48a6da3b0c63fda',
    'path' : ['3212deb55ad1b18ec9031bcf2efcc155398298800fba9b4136a41094d133e28e', 'd2391d4c3e45530b2046f609ac176b8e9869c1e9a71303580b9a28a3d5a7089c'],
    'parentChainHeight' : main_height,
    'verifiedChainId' : 9992731
};

var txInHex ='0a200a1eb4dd19c50944c42351c230175b5063596e6ff219853c358962b0532a285512200a1eaaa58b6cf58d4ef337f6dc55b701fd57d622015a3548a91a4e40892aa355183f22047bf5df9a321243726f7373436861696e5472616e736665723a6e0a200a1e53d0161d3dcfcc68ee03595afdecba5f815176a642fac8a9c1dc37f571c312420a03454c461209656c6620746f6b656e1880a8d6b9072080a8d6b907280432200a1edd8eea50c31966e06e4a2662bebef7ed81d09a47b2eb1eb3729f2f0cc781380118c8012882f4a7014a412b43695977a3fa05ca884ecc51d910ce333fb19f513db4857b8b2b9b550d825c7ddd6beadb9c2cfaf7caf7e24760f91e1e3522190ece9d862aed63cdede4ae2e00';
var bytes = Buffer.from(txInHex, 'hex');

var crossChainReceiveInPut_from_mainchain = {
    'fromChainId' : 9992731,
    'parentChainHeight' : main_height,
    'transferTransactionBytes': bytes,
    'merklePath' : ['02e87a17aae1a61eabd977a5a6743382bf9f44cde7056e9d7d8eb698ef371ebd', '62dc4ebc778745caf81a3abdd68c421ec220124a49234d96c5cf8b774b45cdcb'],
};

var tokenContract_main_1 = aelf.chain.contractAt('4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc', wallet1);
tokenContract_main_1.CrossChainReceiveToken(crossChainReceiveInPut_from_sidechain2);
tokenContract_main_1.GetBalance({'symbol': 'ELF', 'owner' : '2ttnmC14FcoLe8dgwsJBSHYH5mgT5uwa6bbyG4HQeinKX4E'});





var aelf_side1 = new Aelf(new Aelf.providers.HttpProvider("http://localhost:8010/chain"));
// var merklePath = aelf_side1.chain.getMerklePath('72f03ec78a650f7160a6242710a4a16a27fb1dbab321e241ffbd83f00fe5e60c', 20);
// merklePath.forEach(function (path) {
//     console.log(path.toString('hex'));
// });

var wallet1 = wal.getWalletByPrivateKey('7c2627b14e41b7aa2998c1125b9a9b74f682a45438cf4c8566a9ec0465a00a7f');
var crosschainContract_side1 = aelf_side1.chain.contractAt('6NRUWAMzAv2hFNwEfSKqnihQ1XSw2KKJAyZfXG1cr3b9T6n', wallet1);
crosschainContract_side1.GetBoundParentChainHeightAndMerklePathByHeight({'Value':20});
var parent_height = main_height;
var verificationInput ={
    'transactionId' : '8b9d3a1f8497233df41b942f7184c59d54292720938a7428f0c20ff0696c0922',
    'path' : ['18aa01396b3035748a9f564c979d028593879a8f0aa070cd6a28f662b37b0a85', '2185b6c486e79be38cf2e823d1b7dfaf9965035f0b80be2501f283296011c6a3', 'a50ffd2e03f0b36add6dbeeeed3f1a8921e7a2d6c2a76a8f78bf81a88fd2ddc5'],
    'parentChainHeight' : parent_height,
    'verifiedChainId' : 2816514
};
crosschainContract_side1.VerifyTransaction(verificationInput);



var verificationInput_side_chain_1 = {
    'transactionId' : '9aca860bffefd27f5d923162a3a4b40992081f5dcfd4f765150a4144d761af41',
    'path' : ['a87273725e0aa50abe9adec84f91d70d429bb4b868d90f22c5c9daf6d02b5d87', '54552e12299003e6885751442576d37a20c95e7c897e3618f8c0800f937c8d68', 'fc2bc07a2e66414effe71764efa0326a9c354201c1684c7addc8542453efdb46'],
    'parentChainHeight' : 272,
    'verifiedChainId' : 9992731
};
crossChainContract.VerifyTransaction(verificationInput_side_chain_1);

crosschainContract_side1.VerifyTransaction(verificationInput_side_chain_1);

var crossChainSystemName = sha256(Buffer.from('AElf.ContractNames.CrossChain', 'utf8'));
var contractZero_side1 = aelf_side1.chain.contractAt('4Vsgwe6NeHDVkRkGqgMWv2fXt3GYF71ncWDFKHaMaA4iDJ7', wallet1);
contractZero_side1.GetContractAddressByName({"Value": Buffer.from(tokenSystemName, 'hex')});
contractZero_side1.GetContractAddressByName({"Value": Buffer.from(crossChainSystemName, 'hex')});

var tokenContract_side1 = aelf_side1.chain.contractAt('3v3tzwWfS384bSvyDZU1PyVjgXJzPj5Xgj1N55jRrVGmzA9', wallet1);


tokenContract_side1.CrossChainReceiveToken(crossChainReceiveInPut_from_mainchain);
tokenContract_side1.GetBalance({'symbol': 'ELF', 'owner' : '2ttnmC14FcoLe8dgwsJBSHYH5mgT5uwa6bbyG4HQeinKX4E'});

var crossChainTransferInput_side_chain_1 = {
    'to' : '2ttnmC14FcoLe8dgwsJBSHYH5mgT5uwa6bbyG4HQeinKX4E',
    'tokenInfo' : tokenInfo,
    'amount' : 50,
    'toChainId' : 2816514
};
tokenContract_side1.CrossChainTransfer(crossChainTransferInput_side_chain_1);

var side_1_height = 79;
var merklePath_side_chain_1 = aelf_side1.chain.getMerklePath('220ea021adb0caacbcd21fd587740c0a18ca9e634450fdd93d20b2e4234fd8b8', side_1_height);
merklePath_side_chain_1.forEach(function (path) {
    console.log(path.toString('hex'));
});
crosschainContract_side1.GetBoundParentChainHeightAndMerklePathByHeight({'Value': side_1_height});

var txInHex_from_sidechain1 ='0a200a1e53d0161d3dcfcc68ee03595afdecba5f815176a642fac8a9c1dc37f571c312200a1e80ee395414cb759fc3a997f2b1a3db506aa9779bebbdef653aec7121fd68184e22047f5ecde1321243726f7373436861696e5472616e736665723a6d0a200a1e53d0161d3dcfcc68ee03595afdecba5f815176a642fac8a9c1dc37f571c312420a03454c461209656c6620746f6b656e1880a8d6b9072080a8d6b907280432200a1edd8eea50c31966e06e4a2662bebef7ed81d09a47b2eb1eb3729f2f0cc781380118642882f4ab014a41527a251b7c84bad87d1e06ca8adf1d7ded9c08107edd9ac48294bbca940ed3d5388a777e5461babf40d97e7afeaa06a53c80ddfc9e910eb3975dc8427832a67801';
var bytes_from_sidechain1 = Buffer.from(txInHex_from_sidechain1, 'hex');
var crossChainReceiveInPut_from_sidechain1 = {
    'fromChainId' : 2750978,
    'parentChainHeight' : 118,
    'transferTransactionBytes': bytes_from_sidechain1,
    'merklePath' : ['f0fea95b3a689c30a8afcc3dd1a9fcc6d1d9367d0db2af807614db6a2da159e7', 'f3dd55ba14ea376f8868d3ad6b33467085605e2866d1bf9255fcfd503b750892','1479febe35e0da1c0e5fba73ffa7c510d30d232406b75fbf12779087509add59'],
};





var aelf_side2 = new Aelf(new Aelf.providers.HttpProvider("http://localhost:8020/chain"));
aelf_side2.chain.GetChainInformation();

var wallet2 = wal.getWalletByPrivateKey('7c2627b14e41b7aa2998c1125b9a9b74f682a45438cf4c8566a9ec0465a00a7f');
var contractZero_side2 = aelf_side2.chain.contractAt('6Jqy3Yr5HfPLEydQ45xbnmzBzcfGLHMkN3GJb5ccHTuuhvo', wallet2);
contractZero_side2.GetContractAddressByName({"Value": Buffer.from(tokenSystemName, 'hex')});
contractZero_side2.GetContractAddressByName({"Value": Buffer.from(crossChainSystemName, 'hex')});
var crossChainContract_side2 =aelf_side2.chain.contractAt('4EkqvQBy99QHySsUVbvx5uJaMyPvMjizLxWF66zWTtDzJL1', wallet2);
var tokenContract_side2 = aelf_side2.chain.contractAt('3hkwLTqfS1qvesDLLfFiBiuWaVMhjrvdT7zrQ1u75u9az33', wallet2);


tokenContract_side2.CrossChainReceiveToken(crossChainReceiveInPut_from_sidechain1);

var crossChainTransferInput_side_chain_2 = {
    'to' : '2ttnmC14FcoLe8dgwsJBSHYH5mgT5uwa6bbyG4HQeinKX4E',
    'tokenInfo' : tokenInfo,
    'amount' : 15,
    'toChainId' : 9992731
};

tokenContract_side2.CrossChainTransfer(crossChainTransferInput_side_chain_2);
var side_2_height = 251;
var merklePath_side_chain_2 = aelf_side2.chain.getMerklePath('4fb960dd52008d381b7c64a6ff93af5ccc0a14587d2d7a5e1080a1fc40426a4e', side_2_height);
merklePath_side_chain_2.forEach(function (path) {
    console.log(path.toString('hex'));
});
crossChainContract_side2.GetBoundParentChainHeightAndMerklePathByHeight({'Value': side_2_height});

var txInHex_from_sidechain2 ='0a200a1e53d0161d3dcfcc68ee03595afdecba5f815176a642fac8a9c1dc37f571c312200a1e778e3006a12cc609d78bad825f6bc18ff1e354ec7fdaaa02de71c0983abb18fa01220400e58e08321243726f7373436861696e5472616e736665723a6d0a200a1e53d0161d3dcfcc68ee03595afdecba5f815176a642fac8a9c1dc37f571c312420a03454c461209656c6620746f6b656e1880a8d6b9072080a8d6b907280432200a1edd8eea50c31966e06e4a2662bebef7ed81d09a47b2eb1eb3729f2f0cc7813801181e289bf4e1044a4176b5bbdc76244bc77efb103fe4c1e8980a6e605af0912556c80070d44cf227902fd761d858b14895464541a51498aee610fdf651356aadad6a52a613bb6f640800';
var bytes_from_sidechain2 = Buffer.from(txInHex_from_sidechain2, 'hex');
var crossChainReceiveInPut_from_sidechain2 = {
    'fromChainId' : 2816514,
    'parentChainHeight' : 295,
    'transferTransactionBytes': bytes_from_sidechain2,
    'merklePath' : ['0f16329b6f8653594439e11b7c4e35b018b4a6fd85cad94d9615bb58282f9df5', '99c41e8841e677cac47630547eb79212f8a5bfac66165d8a5896a488a6672109','3e50407709bbee096ebf34d22bbf3bc3ad41cc68187540ee242ba129cdfe57fa'],
};

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