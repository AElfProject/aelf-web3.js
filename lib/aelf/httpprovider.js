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
/** @file httpprovider.js
 * @authors:
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

var errors = require('./errors');
var getWebApiInfo = require('../utils/webApiRpcMap').getWebApiInfo;
const objectToUrlParams = require('../utils/objectToUrlParams').objectToUrlParams;
// workaround to use httpprovider in different envs

let XMLHttpRequest;
// browser
if (typeof window !== 'undefined' && window.XMLHttpRequest) {
    XMLHttpRequest = window.XMLHttpRequest; // jshint ignore: line
    // node
}
else {
    XMLHttpRequest = require('@aelfqueen/xmlhttprequest').XMLHttpRequest; // jshint ignore: line
}

var XHR2 = require('xhr2-cookies').XMLHttpRequest; // jshint ignore: line

/**
 * HttpProvider should be used to send rpc calls over http
 */
var HttpProvider = function (host, timeout, user, password, headers) {
    this.host = host || 'http://localhost:8545';
    this.timeout = timeout || 0;
    this.user = user;
    this.password = password;
    this.headers = headers;

    this.isWebApi = false;
    this.method;
    if (this.headers && this.headers.length) {
        this.isWebApi = this.headers.find(item => {
            return item.value.toLowerCase().includes('text/plain');
        });
    }

};

HttpProvider.prototype.prePrepareRequest = function (async, payload) {
    if (this.isWebApi) {
        return this.prepareRequestWebAPI(async, payload);
    }
    return this.prepareRequest(async);
};

const formatWebAPIResult = input => {
    let result;
    let resultTemp;
    try {
        resultTemp = JSON.parse(input);
    }
    catch (e) {
        resultTemp = input;
    }
    if (resultTemp.Error) {
        result = resultTemp;
    }
    else {
        result = {
            jsonrpc: '2.0',
            id: 1,
            result: resultTemp
        };
    }
    return result;
};
// Not Rpc
// TODO: 后续在大调整的时候，拆分出单独的模块。
HttpProvider.prototype.prepareRequestWebAPI = function (async, payload) {
    let request;

    const webApiInfo = getWebApiInfo(this.host, payload.method, payload.params);

    if (async) {
        request = new XHR2();
        request.timeout = this.timeout;
    }
    else {
        request = new XMLHttpRequest();
    }
    request.withCredentials = false;

    request.open(webApiInfo.method, webApiInfo.url, async);
    this.method = webApiInfo.method;

    if (this.method === 'POST') {
        // request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.setRequestHeader('Content-Type', 'application/json');
    }
    if (this.headers) {
        this.headers.forEach(function (header) {
            request.setRequestHeader(header.name, header.value);
        });
    }
    return request;
};

/**
 * Should be called to prepare new XMLHttpRequest
 *
 * @method prepareRequest
 * @param {Boolean} true if request should be async
 * @return {XMLHttpRequest} object
 */
HttpProvider.prototype.prepareRequest = function (async) {
    var request;

    if (async) {
        request = new XHR2();
        request.timeout = this.timeout;
    }
    else {
        request = new XMLHttpRequest();
    }
    request.withCredentials = false;

    request.open('POST', this.host, async);
    if (this.user && this.password) {
        var auth = 'Basic ' + new Buffer(this.user + ':' + this.password).toString('base64');
        request.setRequestHeader('Authorization', auth);
    }
    // 在C#的 jsonrpc库里，有个神奇的逻辑，Content-Type和Accept必须完全匹配application/json, 否则会抛出异常。
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Accept', 'application/json', true);
    if (this.headers) {
        this.headers.forEach(function (header) {
            request.setRequestHeader(header.name, header.value);
        });
    }
    return request;
};

/**
 * Should be called to make sync request
 *
 * @method send
 * @param {Object} payload
 * @return {Object} result
 */
HttpProvider.prototype.send = function (payload) {
    // var request = this.prepareRequest(false);
    var request = this.prePrepareRequest(false, payload);

    try {
        if (this.isWebApi) {
            if (this.method === 'GET') {
                request.send(null);
            }
            else {
                request.send(JSON.stringify(payload.params));
            }
        }
        else {
            request.send(JSON.stringify(payload));
        }
    }
    catch (error) {
        throw errors.InvalidConnection(this.host);
    }

    var result = request.responseText;

    try {
        if (this.isWebApi) {
            result = formatWebAPIResult(result);
        }
        else {
            result = JSON.parse(result);
        }
    }
    catch (e) {
        throw errors.InvalidResponse(request.responseText);
    }

    return result;
};

/**
 * Should be used to make async request
 *
 * @method sendAsync
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
HttpProvider.prototype.sendAsync = function (payload, callback) {
    // var request = this.prepareRequest(true);
    var request = this.prePrepareRequest(true, payload);

    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.timeout !== 1) {
            var result = request.responseText;
            var error = null;

            try {
                if (this.isWebApi) {
                    result = formatWebAPIResult(result);
                }
                else {
                    result = JSON.parse(result);
                }
            }
            catch (e) {
                error = errors.InvalidResponse(request.responseText);
            }

            callback(error, result);
        }
    };

    request.ontimeout = () => {
        callback(errors.ConnectionTimeout(this.timeout));
    };

    try {
        if (this.isWebApi) {
            if (this.method === 'GET') {
                request.send(null);
            }
            else {
                request.send(objectToUrlParams(payload.params));
            }
        }
        else {
            request.send(JSON.stringify(payload));
        }
    }
    catch (error) {
        callback(errors.InvalidConnection(this.host));
    }
};

/**
 * Synchronously tries to make Http request
 *
 * @method isConnected
 * @return {Boolean} returns true if request haven't failed. Otherwise false
 */
HttpProvider.prototype.isConnected = function () {
  try {
    this.send({
      id: 9999,
      jsonrpc: '2.0',
      method: 'getChainStatus',
      params: {}
    });
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = HttpProvider;