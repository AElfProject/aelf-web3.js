/**
 * @file tokenTransfer.js
 * @author hzz780
 * @description
 * You can the output in the chrome devtool.
 * 1. 如何初始化 Aelf How to initialize Aelf.
 * 2. 如何获取一个钱包 How to get a Wallet.
 * 3. 如何连接节点 How to connect the RPC node.
 * 4. 如何初始化合约 How to initialize a contract.
 *     a.如何使用合约方法 How to use contract method.
 *     b.如何使用无交易合约方法 How to use contract method  without tx send.
 *
 */

import Aelf from 'aelf-sdk';

// TODO: You need change the provider to your own rpc node.
const httpProvider = 'http://192.168.197.70:8000/chain';
const httpProviderBackup = 'http://192.168.197.70:8001/chain';
const tokenContract = '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc';
const transferTokenReceiver = '58h3RwTfaE8RDpRNMAMiMv8jUjanCeYHBzKuQfHbrfSFTCn';
const tokenSymbol = 'AELF';
// let aelf;
// let wallet;
// let tokenConctractMethods;
window.aelf; // = aelf;
window.wallet; // = wallet;
window.tokenConctractMethods; // = tokenConctractMethods;
window.TransactionId;

// How to initialize Aelf
// How to connect the RPC node
const initAelfBtn = document.getElementById('init-aelf');
initAelfBtn.onclick = function () {
    window.aelf = new Aelf(new Aelf.providers.HttpProvider(httpProvider));
    console.log('initialize an aelf instance: ', window.aelf);
};
// If you want change to the backup httpProvider.
// rpcNodeIsWork = window.aelf.isConnected(); // sync
// if (!rpcNodeIsWork) {
//     const providerBackupInstance = new Aelf.providers.HttpProvider(httpProviderBackup);
//     window.aelf.setProvider(providerBackupInstance);
// }


// How to get a Wallet.
const createWalletBtn = document.getElementById('create-wallet');
createWalletBtn.onclick = function () {
    window.wallet = Aelf.wallet.createNewWallet();
    console.log('wallet information: ', window.wallet);
};

// How to initialize a contract.
const initTokenContractBtn = document.getElementById('init-token-contract');
initTokenContractBtn.onclick = function () {
    window.aelf.chain.contractAtAsync(tokenContract, wallet, (err, result) => {
        window.tokenConctractMethods = result;
        console.log('token conctract methods: ', window.tokenConctractMethods);
    });
};

// How to use contract method
const transferTokenBtn = document.getElementById('transfer-token');
transferTokenBtn.onclick = function () {
    window.tokenConctractMethods.Transfer({
        symbol: tokenSymbol,
        to: transferTokenReceiver,
        amount: '1000'
    }, (err, result) => {
        console.log('Transfer token: err: ', err, ' || result: ', result);
        window.TransactionId = result.TransactionId;
    });
};

const getTxResult = document.getElementById('get-tx-result');
getTxResult.onclick = function () {
    window.aelf.chain.getTxResult(window.TransactionId, (err, result) => {
        console.log('Transfer token: err: ', err, ' || result: ', result);
        window.TransactionId = result.TransactionId;
    });
};

// How to use contract method  without tx send.
const getBalance = document.getElementById('get-balance');
getBalance.onclick = function () {
    window.tokenConctractMethods.GetBalance.call({
        symbol: tokenSymbol,
        owner: transferTokenReceiver
    }, (err, result) => {
        console.log('Get Balance: ', err, result);
    });
};
