/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file eth.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

'use strict';

const formatters = require('../formatters');
const Contract1 = require('../shims/contract1.js');
const Method = require('../method');
const merkletree = require('../../utils/merkletree');

const methods = function () {
    // call 是match rpc的接口... rpc可能会没有这个接口。
    // 如果是调用webapi， 会在map文件中找到对应的path。
    const getChainStatus = new Method({
        name: 'getChainStatus',
        call: 'chainStatus',
        params: []
    });

    const getChainState = new Method({
        name: 'getChainState',
        call: 'blockState',
        params: ['blockHash']
    });

    const getContractFileDescriptorSet = new Method({
        name: 'getContractFileDescriptorSet',
        call: 'GetFileDescriptorSet',
        params: ['address'],
        inputFormatter: [formatters.inputAddressFormatter],
        outputFormatter: formatters.outputFileDescriptorSetFormatter
    });

    const getBlockHeight = new Method({
        name: 'getBlockHeight',
        call: 'GetBlockHeight',
        params: [],
        inputFormatter: []
    });

    const getBlock = new Method({
        name: 'getBlock',
        call: 'getBlock',
        params: ['blockHash', 'includeTransactions']
    });

    const getBlockByHeight = new Method({
        name: 'getBlockByHeight',
        call: 'getBlockByHeight',
        params: ['blockHeight', 'includeTransactions']
    });

    const getTxResult = new Method({
        name: 'getTxResult',
        call: 'GetTransactionResult',
        params: ['transactionId'],
        inputFormatter: [null]
    });

    const getTxResults = new Method({
        name: 'getTxResults',
        call: 'GetTransactionsResult',
        params: ['blockHash', 'offset', 'num']
    });

    // getTransactionPoolStatus
    const getTransactionPoolStatus = new Method({
        name: 'getTransactionPoolStatus',
        call: 'getTransactionPoolStatus',
        params: []
    });

    const sendTransaction = new Method({
        name: 'sendTransaction',
        call: 'BroadcastTransaction',
        params: ['rawTransaction'],
        inputFormatter: [null]
    });

    const sendTransactions = new Method({
        name: 'sendTransactions',
        call: 'BroadcastTransactions',
        params: ['rawTransaction'],
        inputFormatter: [null]
    });

    const callReadOnly = new Method({
        name: 'callReadOnly',
        call: 'Call',
        params: ['rawTransaction'],
        inputFormatter: [null]
    });

    const getPeers = new Method({
        name: 'getPeers',
        call: 'GetPeers',
        params: []
    });

    const addPeer = new Method({
        name: 'addPeer',
        call: 'AddPeer',
        params: ['address'],
        inputFormatter: [null]
    });

    const removePeer = new Method({
        name: 'removePeer',
        call: 'RemovePeer',
        params: ['address'],
        inputFormatter: [null]
    });

    // getDposStatus, getNodeStatus, getPeers, addPeer, removePeer not support yet
    return [
        getChainStatus,
        getChainState,
        getContractFileDescriptorSet,
        getBlockHeight,
        getBlock,
        getBlockByHeight,
        sendTransaction,
        sendTransactions,
        callReadOnly,
        getTxResult,
        getTxResults,
        getTransactionPoolStatus,
        getPeers,
        addPeer,
        removePeer
    ];
};

// const properties = function () {
//     // TODO: implement
//     return [
//         // new Property({
//         //     name: 'coinbase',
//         //     getter: 'eth_coinbase'
//         // })
//     ];
// };

class Chain {
    constructor(aelf) {
        this._requestManager = aelf._requestManager;
        this._initialized = false;

        methods().forEach(method => {
            method.attachToObject(this);
            method.setRequestManager(this._requestManager);
        });
        // properties().forEach(p => {
        //     p.attachToObject(this);
        //     p.setRequestManager(this._requestManager);
        // });
    }

    contractAt(address, wallet) {
        const fds = this.getContractFileDescriptorSet(address);
        if (fds && fds.file && fds.file.length > 0) {
            const factory = new Contract1(this, fds, wallet);
            return factory.at(address);
        }

        return fds;
    }

    contractAtAsync(address, wallet, callback) {
        if (callback) {
            this.getContractFileDescriptorSet(address, (err, result) => {
                if (result && result.file && result.file.length > 0) {
                    const factory = new Contract1(this, result, wallet);
                    callback(err, factory.at(address));
                    return;
                }
                callback(err, 'getFileDescriptorSet failed');
            });
        }
        else {
            return new Promise((resolve, reject) => {
                this.getContractFileDescriptorSet(address, (err, result) => {
                    if (result && result.file && result.file.length > 0) {
                        const factory = new Contract1(this, result, wallet);
                        resolve([err, factory.at(address)]);
                    } else {
                        reject([err, 'getFileDescriptorSet failed']);
                    }
                });
            });
        }
    }

    getMerklePath(txid, height) {
        const block = this.getBlockByHeight(height, true);
        const txids = block.Body.Transactions;
        const index = txids.findIndex(function (id) {
            return id === txid;
        });
        const nodes = [];
        const chain = this;
        const func = function (id) {
            const txResult = chain.getTxResult(id);
            const status = txResult.Status;
            const buffer = Buffer.concat([Buffer.from(id.replace('0x', ''), 'hex'), Buffer.from(status, 'utf8')]);
            const node = merkletree.node(buffer);
            nodes.push(node);
        };
        txids.forEach(func);
        return merkletree.getMerklePath(index, nodes);
    }
}

module.exports = Chain;
