/*!
 * web3.js - Ethereum JavaScript API
 *
 * @license lgpl-3.0
 * @see https://github.com/ethereum/web3.js
*/

/*
 * This file is part of web3.js.
 * 
 * web3.js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * web3.js is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @file web3.js
 * @authors:
 *   Jeffrey Wilcke <jeff@ethdev.com>
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 *   Gav Wood <g@ethdev.com>
 * @date 2014
 */

var RequestManager = require('./aelf/requestmanager');
var Chain = require('./aelf/methods/chain');
var Settings = require('./aelf/settings');
var version = require('../package.json');
var HttpProvider = require('./aelf/httpprovider');
var wallet = require('./aelf/wallet');
var protobuf = require('@aelfqueen/protobufjs');
var pbUtils = require('./aelf/proto');

/**
 * AElf
 *
 * @constructor
 *
 * @param {Object} provider the instance of HttpProvider
 *
 * @Example
 * const aelf = new AElf(new AElf.providers.HttpProvider('https://127.0.0.1:8000/chain'))
 *
 */
function AElf(provider) {
    this._requestManager = new RequestManager(provider);
    this.currentProvider = provider;
    this.chain = new Chain(this);
    this.settings = new Settings();
    this.version = {
        api: version.version
    };
    this.providers = {
        HttpProvider: HttpProvider
    };
}

// expose providers on the class
AElf.providers = {
    HttpProvider: HttpProvider
};

/**
 * change the provider of the instance of AElf
 *
 * @param {Object} provider the instance of HttpProvider
 *
 * @Example
 * const aelf = new AElf(new AElf.providers.HttpProvider('https://127.0.0.1:8000/chain'));
 * aelf.setProvider(new AElf.providers.HttpProvider('https://127.0.0.1:8010/chain'))
 *
 */
AElf.prototype.setProvider = function (provider) {
    this._requestManager.setProvider(provider);
    this.currentProvider = provider;
};

/**
 * reset
 *
 * @param {boolean} keepIsSyncing true/false
 *
 * @Example
 * // keepIsSyncing = true/false
 * aelf.reset(keepIsSyncing);
 *
 */

AElf.prototype.reset = function (keepIsSyncing) {
    this._requestManager.reset(keepIsSyncing);
    this.settings = new Settings();
};

/**
 * check the rpc node is work or not
 *
 * @return {boolean} true/false whether can connect to the rpc.
 *
 * @Example
 * aelf.isConnected()
 * // return true / false
 *
 */
AElf.prototype.isConnected = function () {
    return (this.currentProvider && this.currentProvider.isConnected());
};

AElf.prototype.wallet = wallet;

/**
 * wallet tool
 */
AElf.wallet = wallet;

/**
 * protobufjs
 */
AElf.pbjs = protobuf;

/**
 * some method about protobufjs of AElf
 */
AElf.pbUtils = pbUtils;

/**
 * get the verion of the SDK
 */
AElf.version = version.version;

if (typeof window !== 'undefined' && !window.AElf) {
    window.AElf = AElf;
}

module.exports = AElf;
