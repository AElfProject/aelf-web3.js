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
    var getCommands = new Method({
        name: 'getCommands',
        call: 'GetCommands',
        params: []
    });

    var connectChain = new Method({
        name: 'connectChain',
        call: 'ConnectChain',
        params: []
    });

    var getContractAbi = new Method({
        name: 'getContractAbi',
        call: 'GetContractAbi',
        params: ['address'],
        inputFormatter: [formatters.inputAddressFormatter],
        outputFormatter: formatters.outputAbiFormatter
    });

    var getFileDescriptorSet = new Method({
        name: 'getFileDescriptorSet',
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

    var getBlockInfo = new Method({
        name: 'getBlockInfo',
        call: 'GetBlockInfo',
        params: ['blockHeight', 'includeTransactions']
    });

    var getIncrement = new Method({
        name: 'getIncrement',
        call: 'get_increment',
        params: ['address'],
        inputFormatter: [formatters.inputAddressFormatter]
    });

    var getTxResult = new Method({
        name: 'getTxResult',
        call: 'GetTransactionResult',
        params: ['transactionId'],
        inputFormatter: [null]
    });

    var getTxsResultByBlockhash = new Method({
        name: 'getTxsResult',
        call: 'GetTransactionsResult',
        params: ['blockHash', 'offset', 'num']
    });

    var getMerklePath = new Method({
        name: 'getMerklePath',
        call: 'GetTransactionMerklePath',
        params: ['transactionId'],
        inputFormatter: [null]
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

    var checkProposal = new Method({
        name: 'checkProposal',
        call: 'check_proposal',
        params: ['proposal_id'],
        inputFormatter: [null]
    });

    var getTxPoolSize = new Method({
        name: 'getTxPoolSize',
        call: 'GetTransactionPoolSize',
        params: []
    });

    var getDposStatus = new Method({
        name: 'getDposStatus',
        call: 'GetDposStatus',
        params: []
    });

    var getNodeStatus = new Method({
        name: 'getNodeStatus',
        call: 'GetNodeStatus',
        params: []
    });

    var getBlockStateSet = new Method({
        name: 'getBlockStateSet',
        call: 'GetBlockStateSet',
        params: ['blockHash'],
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
        getCommands,
        connectChain,
        getContractAbi,
        getFileDescriptorSet,
        getBlockHeight,
        getBlockInfo,
        getIncrement,
        sendTransaction,
        sendTransactions,
        callReadOnly,
        getTxResult,
        getTxsResultByBlockhash,
        getMerklePath,
        checkProposal,
        getTxPoolSize,
        getDposStatus,
        getNodeStatus,
        getBlockStateSet,
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
    var fds = this.getFileDescriptorSet(address);
    if (fds.file && fds.file.length > 0) {
        var factory = new Contract1(this, fds, wallet);
        return factory.at(address);
    }

    var abi = this.getContractAbi(address);
    var factory = new Contract(this, abi, wallet);
    return factory.at(address);
};

// TODO: 2019.03.24前替换了所有合约之后，都使用getFileDescriptorSet
Chain.prototype.contractAtAsync = function (address, wallet, callback) {
    this.getFileDescriptorSet(address, (err, result) => {
        if (result.file && result.file.length > 0) {
            var factory = new Contract1(this, result, wallet);
            callback(err, factory.at(address));
        } else {
            this.getContractAbi(address, (error, abi) => {
                var factory = new Contract(this, abi, wallet);
                var contract = factory.at(address);
                callback(error, contract);
            });
        }
    });
};

Chain.prototype.initChainInfo = function (){
    if(this._initialized){
        return;
    }
    var chainInfo = this.connectChain().result;
    this.chainId = chainInfo.chain_id;
    this.contractZeroAddress = chainInfo.genesis_contract;
    this.contractZeroAbi = this.getContractAbi(this.contractZeroAddress);
    this.contractZero = this.contract(this.contractZeroAbi).at(this.contractZeroAddress);
    this._initialized = true;
};

module.exports = Chain;
