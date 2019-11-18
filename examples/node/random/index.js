/* eslint-env node */
const AElf = require('../../../dist/aelf.cjs');

const Wallet = AElf.wallet;
const {
  sha256
} = AElf.utils;

// address: 2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX
const defaultPrivateKey = 'bdb3b39ef4cd18c2697a920eb6d9e8c3cf1a930570beb37d04fb52400092c42b';
// address: 2C2Acy4saYsnkRYEf54VawvmvUTAvrrWHKbLSwLg33b26woJVu
// pri: cc4f60c45b3d5e112268d8c17d7440e03e850d3f8edf2e55b76bcc68a0b76866

const wallet = Wallet.getWalletByPrivateKey(defaultPrivateKey);
// link to Blockchain
const aelf = new AElf(new AElf.providers.HttpProvider('http://127.0.0.1:1235'));

if (!aelf.isConnected()) {
  console.log('Blockchain Node is not running.');
}

// the contract you want to query
const lotteryContractName = 'AElf.ContractNames.LotteryDemo';
const chainStatus = aelf.chain.getChainStatus({
  sync: true
});
const {
  // directly accessible information
  GenesisContractAddress
} = chainStatus;

const zeroC = aelf.chain.contractAt(GenesisContractAddress, wallet, {
  sync: true
});

const lotteryContractAddress = zeroC.GetContractAddressByName.call(sha256(lotteryContractName), {
  sync: true
});

const lotteryContract = aelf.chain.contractAt(lotteryContractAddress, wallet, {
  sync: true
});

const initialize = lotteryContract.Initialize({
  sponsor: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX',
  startPeriod: 0,
  startTimestamp: {
    seconds: (new Date()).getTime() / 1000
  },
  tokenSymbol: 'ELF',
  ready: true,
}, {
  sync: true
});

console.log('initialInfo', initialize);

try {
  "Error": "\nAElf.Sdk.CSharp.AssertionException: No record now.\n'
  let records = lotteryContract.GetRecord.call({
    offset: 0,
    limit: 10
  }, {
    sync: true
  });
} catch(e) {
  // 错误返回不合适
  // { Code: '20008',
  //    Message: 'Invalid transaction information',
  //    Details: null,
  //    ValidationErrors: null } }
  console.log('record error', e);
}

// init: bf1fca5468599d2e04b24848fb498e2976fa6c976cfcb31540409df40bddd01c
// noRecord: bc196d94ed41890886534ba824a325728eeb5f818b328db3079a94b3ea79d555
lotteryContract.GetRecord({
  offset: 0,
  limit: 10
}, {
  sync: true
});

var record = lotteryContract.GetRecord.call({
  offset: 0,
  limit: 10
}, {
  sync: true
});
console.log(JSON.stringify(record));

// 开启新的一轮
let peroid = lotteryContract.NewPeriod({
  periodNumber: 1,
  //                     bc6672baf5e4984f4f1e0fbe698d170e07ebe8a29320cce17a899495dcd391d0
  randomNumberToken: '7e55bbc211171e48131d8ff7c8c2b38def7923ab717011066658b90219c1cae6' // 0
}, {
  sync: true
});

lotteryContract.GetLuckyNumber({sync: true});

lotteryContract.GetState.call({sync: true});

// message Lotteries {
//   repeated Lottery lottery = 1;
//   aelf.Address saler_address = 2; // 分销员地址
//   sint32 proportion_sale = 3; // 销售分成 [0, 15] default 0
//   sint32 proportion_bonus = 4; // 兑奖分成 [0, 5] default 0
//   sint64 target_period = 5; // 当前期数，在APP里做
//   aelf.Address sender_address = 6; // 用户地址
// }

// message Lottery {
//   sint32 type = 1;
//   repeated sint32 value = 2;
// }
var lottery = [];
for (let i = 0; i <= 9; i++) {
  lottery.push({
    type: 1,
    value: [0, 0, 0, 0, i]
  });
}

lotteryContract.Bet({
  salerAddress: '2C2Acy4saYsnkRYEf54VawvmvUTAvrrWHKbLSwLg33b26woJVu',
  proportionSale: 5,
  proportionBonus: 5,
  targetPeriod: 0,
  senderAddress: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX',
  lottery
}, {sync: true});

lotteryContract.Bet({
  salerAddress: '2C2Acy4saYsnkRYEf54VawvmvUTAvrrWHKbLSwLg33b26woJVu',
  proportionSale: 5,
  proportionBonus: 5,
  targetPeriod: 1,
  senderAddress: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX',
  lottery: [
    {type: 1, value: [0, 0, 0, 0, 3]},
    {type: 1, value: [0, 0, 0, 0, 4]},
    {type: 1, value: [0, 0, 0, 0, 5]},
  ]
}, {sync: true});

lotteryContract.TakeReward('a24fec480944c16f0ed250cb3412e2b27312afc59adad6941adb20eb08b1a3c9', {
  sync: true
});

console.log('tx', aelf.chain.getTxResult('4c12bd187803fa1b63ac5794f614496154454725aa6c6747c890cdab39708e02', {
  sync: true
}));
console.log('RandomToken', RandomToken);
