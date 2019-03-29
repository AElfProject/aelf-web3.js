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

function Aelf(provider) {
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
Aelf.providers = {
    HttpProvider: HttpProvider
};

Aelf.prototype.setProvider = function (provider) {
    this._requestManager.setProvider(provider);
    this.currentProvider = provider;
};

Aelf.prototype.reset = function (keepIsSyncing) {
    this._requestManager.reset(keepIsSyncing);
    this.settings = new Settings();
};

Aelf.prototype.isConnected = function () {
    return (this.currentProvider && this.currentProvider.isConnected());
};

Aelf.prototype.wallet = wallet;
Aelf.wallet = wallet;
Aelf.pbjs = protobuf;
Aelf.pbUtils = pbUtils;
Aelf.version = version.version;

if (typeof window !== 'undefined' && !window.Aelf) {
    window.Aelf = Aelf;
}

module.exports = Aelf;
