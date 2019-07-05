/**
 * @file httpprovider.js
 * @author huangzongzhe, gl
 * Thanks web3.js
 */

const errors = require('./errors');

let XMLHttpRequest;
// browser
if (typeof window !== 'undefined' && window.XMLHttpRequest) {
    XMLHttpRequest = window.XMLHttpRequest; // jshint ignore: line
    // node
}
else {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest; // jshint ignore: line
}

const XHR2 = require('xhr2-cookies').XMLHttpRequest; // jshint ignore: line

const formatWebAPIResult = input => {
    let result;
    let resultTemp;
    try {
        resultTemp = JSON.parse(input);
    }
    catch (e) {
        resultTemp = input;
    }

    result = {
        result: resultTemp
    };

    return result;
};

/**
 * HttpProvider should be used to send rpc calls over http
 */
class HttpProvider {
    constructor(host, timeout, user, password, headers) {
        this.host = host || 'http://localhost:8545';
        this.timeout = timeout || 0;
        this.user = user;
        this.password = password;
        this.headers = headers || [{
            name: 'Accept',
            value: 'text/plain;v=1.0'
        }];

        this.isWebApi = true;
        this.method;
    }

    prepareRequestWebAPI(async, payload) {
        let request;

        const webApiInfo = {
            ...payload
        };
        webApiInfo.url = this.host + '/api/' + webApiInfo.url;

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
            request.setRequestHeader('Content-Type', 'application/json');
        }
        if (this.headers) {
            this.headers.forEach(function (header) {
                request.setRequestHeader(header.name, header.value);
            });
        }
        return request;
    }

    /**
     * Should be called to make sync request
     *
     * @method send
     * @param {Object} payload params
     * @return {Object} result
     */
    send(payload) {
        const request = this.prepareRequestWebAPI(false, payload);

        try {
            if (this.method === 'GET') {
                request.send(null);
            }
            else {
                request.send(JSON.stringify(payload.params));
            }
        }
        catch (error) {
            throw errors.InvalidConnection(this.host);
        }

        let result = request.responseText;

        try {
            result = formatWebAPIResult(result);
        }
        catch (e) {
            throw errors.InvalidResponse(request.responseText);
        }

        return result;
    }

    /**
     * Should be used to make async request
     *
     * @method sendAsync
     * @param {Object} payload payload
     * @param {Function} callback triggered on end with (err, result)
     */
    sendAsync(payload, callback) {
        const request = this.prepareRequestWebAPI(true, payload);

        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.timeout !== 1) {
                let result = request.responseText;
                let error = null;

                try {
                    result = formatWebAPIResult(result);
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
            if (this.method === 'GET') {
                request.send(null);
            }
            else {
                request.send(JSON.stringify(payload.params));
            }
        }
        catch (error) {
            callback(errors.InvalidConnection(this.host));
        }
    }

    /**
     * Synchronously tries to make Http request
     *
     * @method isConnected
     * @return {boolean} returns true if request haven't failed. Otherwise false
     */
    isConnected() {
        try {
            this.send({
                method: 'GET',
                url: 'blockChain/chainStatus'
            });
            return true;
        }
        catch (e) {
            return false;
        }
    }
}

module.exports = HttpProvider;
