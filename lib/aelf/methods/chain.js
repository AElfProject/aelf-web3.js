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

"use strict";

var formatters = require('../formatters');
var Contract1 = require('../shims/contract1.js');
var Contract = require('../shims/contract.js');
var Method = require('../method');
var c = require('../../utils/config');
var merkletree = require('../../utils/merkletree');

// var blockCall = function (args) {
//     return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? "eth_getBlockByHash" : "eth_getBlockByNumber";
// };

// var transactionFromBlockCall = function (args) {
//     return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getTransactionByBlockHashAndIndex' : 'eth_getTransactionByBlockNumberAndIndex';
// };

// var uncleCall = function (args) {
//     return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleByBlockHashAndIndex' : 'eth_getUncleByBlockNumberAndIndex';
// };

// var getBlockTransactionCountCall = function (args) {
//     return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getBlockTransactionCountByHash' : 'eth_getBlockTransactionCountByNumber';
// };

// var uncleCountCall = function (args) {
//     return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'eth_getUncleCountByBlockHash' : 'eth_getUncleCountByBlockNumber';
// };

function Chain(aelf) {
    this._requestManager = aelf._requestManager;
    this._initialized = false;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });

    properties().forEach(function(p) {
        p.attachToObject(self);
        p.setRequestManager(self._requestManager);
    });
}

Object.defineProperty(Chain.prototype, 'chainId', {
    get: function () {
        return c.chainId;
    },
    set: function (val) {
        c.chainId = val;
        return val;
    }
});

Object.defineProperty(Chain.prototype, 'contractZeroAddress', {
    get: function () {
        return c.contractZeroAddress;
    },
    set: function (val) {
        c.contractZeroAddress = val;
        return val;
    }
});


Object.defineProperty(Chain.prototype, 'contractZeroAbi', {
    get: function () {
        return c.contractZeroAbi;
    },
    set: function (val) {
        c.contractZeroAbi = val;
        return val;
    }
});

Object.defineProperty(Chain.prototype, 'contractZero', {
    get: function () {
        return c.contractZero;
    },
    set: function (val) {
        c.contractZero = val;
        return val;
    }
});


Object.defineProperty(Chain.prototype, 'defaultAccount', {
    get: function () {
        return c.defaultAccount;
    },
    set: function (val) {
        c.defaultAccount = val;
        return val;
    }
});

var methods = function () {
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

    var getContractFileDescriptorSet = new Method({
        name: 'getContractFileDescriptorSet',
        call: 'GetFileDescriptorSet',
        params: ['address'],
        inputFormatter: [formatters.inputAddressFormatter],
        outputFormatter: formatters.outputFileDescriptorSetFormatter
    });

    var getBlockHeight = new Method({
        name: 'getBlockHeight',
        call: 'GetBlockHeight',
        params: [],
        inputFormatter: []
    });

    var getBlock = new Method({
        name: 'getBlock',
        call: 'getBlock',
        params: ['blockHash', 'includeTransactions']
    });

    var getBlockByHeight = new Method({
        name: 'getBlockByHeight',
        call: 'getBlockByHeight',
        params: ['blockHeight', 'includeTransactions']
    });

    var getTxResult = new Method({
        name: 'getTxResult',
        call: 'GetTransactionResult',
        params: ['transactionId'],
        inputFormatter: [null]
    });

    var getTxResults = new Method({
        name: 'getTxResults',
        call: 'GetTransactionsResult',
        params: ['blockHash', 'offset', 'num']
    });

    // getTransactionPoolStatus
    var getTransactionPoolStatus = new Method({
        name: 'getTransactionPoolStatus',
        call: 'getTransactionPoolStatus',
        params: []
    });

    var sendTransaction = new Method({
        name: 'sendTransaction',
        call: 'BroadcastTransaction',
        params: ['rawTransaction'],
        inputFormatter: [null]
    });

    var sendTransactions = new Method({
        name: 'sendTransactions',
        call: 'BroadcastTransactions',
        params: ['rawTransaction'],
        inputFormatter: [null]
    });

    var callReadOnly = new Method({
        name: 'callReadOnly',
        call: 'Call',
        params: ['rawTransaction'],
        inputFormatter: [null]
    });

    var getPeers = new Method({
        name: 'getPeers',
        call: 'GetPeers',
        params: []
    });

    var addPeer = new Method({
        name: 'addPeer',
        call: 'AddPeer',
        params: ['address'],
        inputFormatter: [null]
    });

    var removePeer = new Method({
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

var properties = function () {
    // TODO: implement
    return [
        // new Property({
        //     name: 'coinbase',
        //     getter: 'eth_coinbase'
        // })
    ];
};

Chain.prototype.contract = function (abi, wallet) {
    var factory = new Contract(this, abi, wallet);
    return factory;
};

Chain.prototype.contractAt = function (address, wallet) {
    var fds = this.getContractFileDescriptorSet(address);
    if (fds && fds.file && fds.file.length > 0) {
        var factory = new Contract1(this, fds, wallet);
        return factory.at(address);
    }

    return fds;
};

// TODO: 2019.03.24前替换了所有合约之后，都使用getFileDescriptorSet
Chain.prototype.contractAtAsync = function (address, wallet, callback) {
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
                }
                else {
                    reject([err, 'getFileDescriptorSet failed']);
                }
            });
        });
    }
};

Chain.prototype.getMerklePath = function(txid, height){
    var block = this.getBlockByHeight(height, true);
    var txids = block['Body']['Transactions'];
    var index = txids.findIndex(function (id) { return id === txid;});
    var nodes = [];
    var chain = this;
    var func = function (id) {
        var txResult = chain.getTxResult(id);
        var status = txResult['Status'];
        var buffer = Buffer.concat([Buffer.from(id.replace('0x', ''), 'hex'), Buffer.from(status, 'utf8')]);
        var node = merkletree.node(buffer);
        nodes.push(node);
    };
    txids.forEach(func);
    return merkletree.getMerklePath(index, nodes);
};

module.exports = Chain;
