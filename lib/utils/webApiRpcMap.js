/**
 * @file webApiRpcMap.js
 * @author huangzongzhe
 * 从已有方法获得正确的 webApi请求接口。
 * TODO: 后续重构时，记得整理
 */
const objectToUrlParams = require('../utils/objectToUrlParams').objectToUrlParams;
module.exports.getWebApiInfo = (host, method, params) => {
    const chainMap = {
        'chainStatus': {
            name: 'chainStatus',
            method: 'GET'
        },
        'blockState': {
            name: 'blockState',
            method: 'GET'
        },
        'Call': {
            name: 'call',
            method: 'POST'
        },
        'GetFileDescriptorSet': {
            name: 'contractFileDescriptorSet',
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
            name: 'transactionResults',
            method: 'GET'
        },
        'getTransactionPoolStatus': {
            name: 'transactionPoolStatus',
            method: 'GET'
        },
        'GetBlockHeight': {
            name: 'blockHeight',
            method: 'GET'
        },
        'getBlockByHeight': {
            name: 'blockByHeight',
            method: 'GET'
        },
        'GetBlockInfo': {
            name: 'blockByHeight',
            method: 'GET'
        },
        'getBlock': {
            name: 'block',
            method: 'GET'
        }
    };

    const netMap = {
        'GetPeers': {
            name: 'peers',
            method: 'GET'
        },
        'AddPeer': {
            name: 'peer',
            method: 'POST'
        },
        'RemovePeer': {
            name: 'peer',
            method: 'DELETE'
        }
    };

    let mapType = 'blockChain';
    let output = chainMap[method] || {
        name: '',
        method: 'GET'
    };

    if (!output.name) {
        mapType = 'net';
        output = netMap[method] || {
            name: '',
            method: 'GET'
        };
    }

    output.url = host.replace('/chain', `/api/${mapType}`) + '/' + output.name;
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
