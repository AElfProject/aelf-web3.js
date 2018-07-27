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
 * @file function.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var coder = require('../types/coder');
var utils = require('../../utils/utils');
var config = require('../../utils/config');
var errors = require('../errors');
var proto = require('../proto.js');
var wallet = require('../wallet.js');

/**
 * This prototype should be used to call/sendTransaction to solidity functions
 */
var ContractMethod = function (chain, methodAbi, address, wallet) {
    this._chain = chain;
    this._paramTypes = methodAbi.Params.map(function (i) {
        return i.Type;
    });
    this._returnType = methodAbi.ReturnType;
    this._name = methodAbi.Name;
    // contract address
    this._address = address;

    // wallet = {address: [String], keyPair: [Object]}
    this._wallet = wallet;
};

ContractMethod.prototype.extractCallback = function (args) {
    if (utils.isFunction(args[args.length - 1])) {
        return args.pop(); // modify the args array!
    }
};

/**
 * Should be called to check if the number of arguments is correct
 *
 * @method validateArgs
 * @param {Array} arguments
 * @throws {Error} if it is not
 */
ContractMethod.prototype.validateArgs = function (args) {
    var inputArgs = args;
    // .filter(function (a) {
    //   // filter the options object but not arguments that are arrays
    //   return !( (utils.isObject(a) === true) &&
    //             (utils.isArray(a) === false) &&
    //             (utils.isBigNumber(a) === false)
    //           );
    // });
    if (inputArgs.length !== this._paramTypes.length) {
        throw errors.InvalidNumberOfRPCParams();
    }
};

/**
 * Should be used to create payload from arguments
 *
 * @method toPayload
 * @param {Array} solidity function params
 * @param {Object} optional payload options
 */
ContractMethod.prototype.toPayload = function (args) {
    var rawtx = proto.getTransaction(this._wallet.address, this._address, this._name, coder.encodeParams(this._paramTypes, args))
    var incr = this._chain.getIncrement(this._wallet.address).result.increment;
    rawtx.IncrementId = incr;
    // var options = {};
    // options.From = config.defaultAccount;
    // options.To = this._address;
    // options.MethodName = this._name;
    // options.Params = coder.encodeParams(this._paramTypes, args);
    // return options;
    var tx = wallet.signTransaction(rawtx, this._wallet.keyPair);
    tx = proto.Transaction.encode(tx).finish();
    if (tx.__proto__.constructor === Buffer) {
        return tx.toString('hex');
    } else {
        return utils.uint8ArrayToHex(tx);
    }
    // return proto.Transaction.encode(tx).finish().toString('hex');
};

ContractMethod.prototype.unpackOutput = function (output) {
    if (!output) {
        return;
    }
    if(this._returnType == 'void'){
        return null;
    }

    var buffer = Buffer.from(output.replace('0x', ''), 'hex');
    var result = coder.decodeParam(this._returnType, buffer);
    return result;
};

/**
 * Should be used to sendTransaction to solidity function
 *
 * @method sendTransaction
 */
ContractMethod.prototype.sendTransaction = function () {
    var args = Array.prototype.slice.call(arguments).filter(function (a) {return a !== undefined; });
    var callback = this.extractCallback(args);
    var payload = this.toPayload(args);

    if (!callback) {
        return this._chain.sendTransaction(payload);
    }

    this._chain.sendTransaction(payload, callback);
};

/**
 * Return the encoded data of the call
 *
 * @method getData
 * @return {String} the encoded data
 */
ContractMethod.prototype.getData = function () {
    var args = Array.prototype.slice.call(arguments);
    var payload = this.toPayload(args);

    return payload.Params;
};

/**
 * Should be used to get function display name
 *
 * @method displayName
 * @return {String} display name of the function
 */
ContractMethod.prototype.displayName = function () {
    return this._name;
};

/**
 * Should be used to get function type name
 *
 * @method typeName
 * @return {String} type name of the function
 */
ContractMethod.prototype.typeName = function () {
    return "";
};

/**
 * Should be called to get rpc requests from solidity function
 *
 * @method request
 * @returns {Object}
 */
ContractMethod.prototype.request = function () {
    var args = Array.prototype.slice.call(arguments);
    var callback = this.extractCallback(args);
    var payload = this.toPayload(args);
    var format = this.unpackOutput.bind(this);

    return {
        method: 'broadcast_tx',
        callback: callback,
        params: payload,
        format: format
    };
};

/**
 * Should be called to execute function
 *
 * @method execute
 */
ContractMethod.prototype.execute = function () {
    // Currently there is only sendTransaction
        return this.sendTransaction.apply(this, Array.prototype.slice.call(arguments));
};

/**
 * Should be called to attach function to contract
 *
 * @method attachToContract
 * @param {Contract}
 */
ContractMethod.prototype.attachToContract = function (contract) {
    var execute = this.execute.bind(this);
    execute.request = this.request.bind(this);
    execute.sendTransaction = this.sendTransaction.bind(this);
    execute.getData = this.getData.bind(this);
    var displayName = this.displayName();
    if (!contract[displayName]) {
        contract[displayName] = execute;
    }
    contract[displayName][this.typeName()] = execute; // circular!!!!
};

module.exports = ContractMethod;
