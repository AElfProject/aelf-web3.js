/**
 * @file webApiRpcMap.js
 * @author huangzongzhe
 * 从已有方法获得正确的 webApi请求接口。
 * TODO: 后续重构时，记得整理
 */
const objectToUrlParams = require('../utils/objectToUrlParams').objectToUrlParams;
module.exports.getWebApiInfo = (host, method, params) => {
    const map = {
        'GetChainInformation': {
            name: 'chainInformation',
            method: 'GET'
        },
        'Call': {
            name: 'call',
            method: 'POST'
        },
        'GetFileDescriptorSet': {
            name: 'fileDescriptorSet',
            method: 'GET'
        },
        'BroadcastTransaction': {
            name: 'broadcastTransaction',
            method: 'POST'
        },
        'BroadcastTransactions': {
            name: 'broadcastTransactions',
            method: 'POST'
        },
        'GetTransactionResult': {
            name: 'transactionResult',
            method: 'GET'
        },
        'GetTransactionsResult': {
            name: 'transactionsResult',
            method: 'GET'
        },
        'GetBlockHeight': {
            name: 'blockHeight',
            method: 'GET'
        },
        'GetBlockInfo': {
            name: 'blockInfo',
            method: 'GET'
        }
    };

    const output = map[method] || {
        name: '',
        method: 'GET'
    };
    output.url = host.replace('/chain', '/api/chain') + '/' + output.name;
    if (output.method === 'GET') {
        output.url += '?' + objectToUrlParams(params);
    }

    return output;
};

// const output = {
//     jsonrpc: '2.0',
//     id: 1,
//     result: {
//         GenesisContractAddress: '61W3AF3Voud7cLY2mejzRuZ4WEN8mrDMioA9kZv3H8taKxF',
//         ChainId: 'AELF'
//     }
// };
