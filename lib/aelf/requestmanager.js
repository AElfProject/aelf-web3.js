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
 * @file requestmanager.js
 * @author hzz780
 * @author Jeffrey Wilcke <jeff@ethdev.com>
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Marian Oancea <marian@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @author Gav Wood <g@ethdev.com>
 * @date 2014
 */

// const Jsonrpc = require('./jsonrpc');
// var c = require('../utils/config');
const errors = require('./errors');
const objectToUrlParams = require('../utils/objectToUrlParams').objectToUrlParams;

const webApiToPayload = function (data) {
    // const demo = {
    //     "method": "blockChain/GetFileDescriptorSet",
    //     "requestMethod": "GET",
    //     "type": "net",
    //     "params": {
    //         "address": "WnV9Gv3gioSh3Vgaw8SSB96nV8fWUNxuVozCf6Y14e7RXyGaM"
    //     }
    // }
    let output = {
        method: data.requestMethod,
        url: data.method,
        params: data.params
    };
    if (output.method === 'GET') {
        output.url += '?' + objectToUrlParams(data.params);
    }

    return output;
};

/**
 * It's responsible for passing messages to providers
 * It's also responsible for polling the ethereum node for incoming messages
 * Default poll timeout is 1 second
 * Singleton
 */
class RequestManager{
    constructor(provider) {
        this.provider = provider;
        this.polls = {};
        this.timeout = null;
    }

    /**
     * Should be used to synchronously send request
     *
     * @method send
     * @param {Object} data data
     * @return {Object}
     */
    send(data) {
        if (!this.provider) {
            // console.error(errors.InvalidProvider());
            return null;
        }

        let payload = webApiToPayload(data);
        let result = this.provider.send(payload);
        // if (!Jsonrpc.isValidResponse(result)) {
        //     throw errors.InvalidResponse(result);
        // }

        return result.result;
    }

    /**
     * Should be used to asynchronously send request
     *
     * @method sendAsync
     * @param {Object} data data
     * @param {Function} callback fn
     */
    sendAsync(data, callback) {
        if (!this.provider) {
            return callback(errors.InvalidProvider());
        }

        let payload = webApiToPayload(data);
        this.provider.sendAsync(payload, function (err, result) {
            if (err) {
                callback(err);
            }
            // else if (!Jsonrpc.isValidResponse(result)) {
            //     return callback(errors.InvalidResponse(result));
            // }
            else {
                callback(null, result.result);
            }
        });
    }

    /**
     * Should be used to set provider of request manager
     *
     * @method setProvider
     * @param {Object} p provider
     */
    setProvider(p) {
        this.provider = p;
    }
}

module.exports = RequestManager;

// /**
//  * Should be used to start polling
//  *
//  * @method startPolling
//  * @param {Object} data
//  * @param {Number} pollId
//  * @param {Function} callback
//  * @param {Function} uninstall
//  *
//  * @todo cleanup number of params
//  */
// RequestManager.prototype.startPolling = function (data, pollId, callback, uninstall) {
//     this.polls[pollId] = {data: data, id: pollId, callback: callback, uninstall: uninstall};


//     // start polling
//     if (!this.timeout) {
//         this.poll();
//     }
// };

// /**
//  * Should be used to stop polling for filter with given id
//  *
//  * @method stopPolling
//  * @param {Number} pollId
//  */
// RequestManager.prototype.stopPolling = function (pollId) {
//     delete this.polls[pollId];

//     // stop polling
//     if(Object.keys(this.polls).length === 0 && this.timeout) {
//         clearTimeout(this.timeout);
//         this.timeout = null;
//     }
// };

// /**
//  * Should be called to reset the polling mechanism of the request manager
//  *
//  * @method reset
//  */
// RequestManager.prototype.reset = function (keepIsSyncing) {
//     /*jshint maxcomplexity:5 */

//     for (var key in this.polls) {
//         // remove all polls, except sync polls,
//         // they need to be removed manually by calling syncing.stopWatching()
//         if(!keepIsSyncing || key.indexOf('syncPoll_') === -1) {
//             this.polls[key].uninstall();
//             delete this.polls[key];
//         }
//     }

//     // stop polling
//     if(Object.keys(this.polls).length === 0 && this.timeout) {
//         clearTimeout(this.timeout);
//         this.timeout = null;
//     }
// };
