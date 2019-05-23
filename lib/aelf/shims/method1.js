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
/* eslint-disable fecs-camelcase */

var coder = require('../types/coder');
var utils = require('../../utils/utils');
var config = require('../../utils/config');
var errors = require('../errors');
var proto = require('../proto.js');
var wallet = require('../wallet.js');

/**
 * Checks if a field is an Address/Hash type.
 * @param {Object} resolvedType 
 */
var isWrappedBytes = function (resolvedType, name){
    if(!resolvedType.name || resolvedType.name != name){
        return false;
    }
    if(!resolvedType.fieldsArray || resolvedType.fieldsArray.length != 1){
        return false;
    }
    return resolvedType.fieldsArray[0].type == 'bytes';
}

var getFieldPaths = function (checker, resolvedType, path){
    if(!resolvedType){
        return [];
    }
    if(checker(resolvedType)){
        return [path];
    }
    var paths = [];
    resolvedType.resolve();
    if(!resolvedType.fieldsArray){
        return paths;
    }
    for(var i = 0; i < resolvedType.fieldsArray.length; i++){
        var fld = resolvedType.fieldsArray[i];
        paths = paths.concat(getFieldPaths(checker, fld.resolve().resolvedType, path.concat([fld.name])));
    }
    return paths;
}

// reformatter is executed when parents are not empty
var reformat = function (obj, forSelf, paths, reformatter){
    if (forSelf) {
        return reformatter(obj);
    }
    if(!paths || paths.length == 0){
        return obj;
    }
    for(var j = 0; j < paths.length; j++){
        var path = paths[j];
        var parent = obj;
        for(var i = 0; i < path.length - 1; i++){
            parent = parent[path[i]];
            if(!parent) break;
        }
        if (!parent) {
            continue;
        }
        var name = path[path.length - 1];
        var target = parent[name];
        if(!target){
            continue;
        }

        parent[name] = reformatter(target);
    }
    return obj;
}

var isAddress = function (resolvedType){
    return isWrappedBytes(resolvedType, "Address");
}

var getAddressFieldPaths = function (resolvedType, path=[]){
    return getFieldPaths(isAddress, resolvedType, path);
}

var maybeUglifyAddress = function (obj, forSelf, paths){
    return reformat(obj, forSelf, paths, (target) => {
        if (typeof target === 'string') {
            return proto.getAddressObjectFromRep(target);
        }
        return target;
    });
}

var maybePrettifyAddress = function (obj, forSelf, paths){
    return reformat(obj, forSelf, paths, (target) => {
        if(typeof target !== 'string'){
            return proto.getRepForAddress(target);
        }
        return target;
    });
}

var isHash = function(resolvedType){
    return isWrappedBytes(resolvedType, 'Hash');
}

var getHashFieldPaths = function (resolvedType, path=[]){
    return getFieldPaths(isHash, resolvedType, path);
}

var maybeUglifyHash = function (obj, forSelf, paths){
    return reformat(obj, forSelf, paths, (target) => {
        if (typeof target === 'string') {
            return proto.getHashObjectFromHex(target);
        }
        if(Array.isArray(target)){
            return target.map(function (h) {
                return proto.getHashObjectFromHex(h);
            });
        }
        return target;
    });
}

var maybePrettifyHash = function (obj, forSelf, paths){
    return reformat(obj, forSelf, paths, (target)=> {
        if(typeof target !== 'string'){
            return proto.getRepForHash(target);
        }
        return target;
    });
}

// /**
//  * This prototype should be used to call/sendTransaction to solidity functions
//  */
/**
 * 
 * @method ContractMethod
 * @param {Chain} chain 
 * @param {Method} method 
 * @param {String} address 
 * @param {KeyPair} wallet 
 */
var ContractMethod = function (chain, method, address, wallet) {
    this._chain = chain;
    this._method = method;
    this._inputType = method.resolvedRequestType;
    this._outputType = method.resolvedResponseType;
    this._inputTypeAddressFieldPaths = getAddressFieldPaths(this._inputType);
    this._outputTypeAddressFieldPaths = getAddressFieldPaths(this._outputType);
    this._inputTypeHashFieldPaths = getHashFieldPaths(this._inputType);
    this._outputTypeHashFieldPaths = getHashFieldPaths(this._outputType);
    this._isInputTypeAddress = isAddress(this._inputType);
    this._isInputTypeHash = isHash(this._inputType);
    this._isOutputTypeAddress = isAddress(this._outputType);
    this._isOutputTypeHash = isHash(this._outputType);
    this._name = method.name;

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
    var error = this._inputType.verify(args);
    if(error)
        throw Error(err);
};

/**
 * Should be used to create payload from arguments
 *
 * @method toPayload
 * @param {Array} solidity function params
 * @param {Object} optional payload options
 */
ContractMethod.prototype.toPayload = function (args) {
    let encoded = this.packInput(args[0]);
    let rawtx = proto.getTransaction(this._wallet.address, this._address, this._name, encoded);

    // TODO: Move this chunk into utils
    let block_height = JSON.parse(this._chain.getBlockHeight(), 10);
    let block_info = this._chain.getBlockByHeight(block_height, false);

    rawtx.RefBlockNumber = block_height;
    let blockhash = block_info.BlockHash;
    blockhash = blockhash.match(/^0x/) ? blockhash.substring(2) : blockhash;

    rawtx.RefBlockPrefix = (new Buffer(blockhash, 'hex')).slice(0, 4);
    // do not need set the value of TransactionType
    // var incr = this._isView ? 0 : this._chain.getIncrement(this._wallet.address).result.increment;
    // rawtx.IncrementId = 0;
    // var options = {};
    // options.From = config.defaultAccount;
    // options.To = this._address;
    // options.MethodName = this._name;
    // options.Params = coder.encodeParams(this._paramTypes, args);
    let tx = wallet.signTransaction(rawtx, this._wallet.keyPair);

    tx = proto.Transaction.encode(tx).finish();
    if (tx.__proto__.constructor === Buffer) {
        return tx.toString('hex');
    }
    return utils.uint8ArrayToHex(tx);
};

/**
 * Should be used to create payload from arguments
 *
 * @method toPayloadAsync
 * @param {Array} solidity function params
 * @param {Object} optional payload options
 */
ContractMethod.prototype.toPayloadAsync = function (args) {
    var rawtx = proto.getTransaction(
        this._wallet.address,
        this._address,
        this._name,
        this.packInput(args[0])
    );
    return new Promise((resolve, reject) => {
        this._chain.getBlockHeight((error, item) => {
            let blockHeight = parseInt(item, 10);
            this._chain.getBlockByHeight(blockHeight, false, (error, item) => {
                let blockInfo = item;

                rawtx.RefBlockNumber = blockHeight;
                let blockhash = blockInfo.BlockHash || blockInfo.blockHash;
                blockhash = blockhash.match(/^0x/) ? blockhash.substring(2) : blockhash;

                rawtx.RefBlockPrefix = (new Buffer(blockhash, 'hex')).slice(0, 4);
                let tx = wallet.signTransaction(rawtx, this._wallet.keyPair);
                tx = proto.Transaction.encode(tx).finish();
                if (tx.__proto__.constructor === Buffer) {
                    resolve(tx.toString('hex'));
                }
                else {
                    resolve(utils.uint8ArrayToHex(tx));
                }
            });
        });
    });
};

ContractMethod.prototype.packInput = function (input) {
    if (!input) {
        return;
    }

    input = maybeUglifyAddress(input, this._isInputTypeAddress, this._inputTypeAddressFieldPaths);
    input = maybeUglifyHash(input, this._isInputTypeHash, this._inputTypeHashFieldPaths);
    let message = this._inputType.fromObject(input);
    let bytes = this._inputType.encode(message).finish();
    return bytes;
};

ContractMethod.prototype.unpackOutput = function (output) {
    if (!output) {
        return;
    }

    // TODO: Check why this is encoded in "hex"
    var buffer = Buffer.from(output, 'hex');
    var decoded = this._outputType.decode(buffer);
    var result = this._outputType.toObject(decoded, {
        enums: String,  // enums as string names
        longs: String,  // longs as strings (requires long.js)
        bytes: String,  // bytes as base64 encoded strings
        defaults: true, // includes default values
        arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
        objects: true,  // populates empty objects (map fields) even if defaults=false
        oneofs: true    // includes virtual oneof fields set to the present field's name
      });
    result = maybePrettifyAddress(result, this._isOutputTypeAddress, this._outputTypeAddressFieldPaths);
    result = maybePrettifyHash(result, this._isOutputTypeHash, this._outputTypeHashFieldPaths);
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
    if (!callback) {
        var payload = this.toPayload(args);
        // TODO: 是否在发送完之后，在返回结果带上payload.
        console.log('transaction payload', payload);
        return this._chain.sendTransaction(payload);
    }
    this.toPayloadAsync(args).then(payload => {
        this._chain.sendTransaction(payload, callback);
    });
};

/**
 * Should be used to callReadOnly to solidity function
 *
 * @method sendTransaction
 */
ContractMethod.prototype.callReadOnly = function () {
    var args = Array.prototype.slice.call(arguments).filter(function (a) {return a !== undefined; });
    var callback = this.extractCallback(args);
    if (!callback) {
        var payload = this.toPayload(args);
        var returnBytes = this._chain.callReadOnly(payload);
        return this.unpackOutput(returnBytes);
    }

    this.toPayloadAsync(args).then(payload => {
        // It is a stupid way.
        this._chain.callReadOnly(payload, this.unpackOutput.bind(this), callback);
    });
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
    execute.call = this.callReadOnly.bind(this);
    execute.inputTypeInfo = this._inputType.toJSON();
    execute.outputTypeInfo = this._outputType.toJSON();
    execute.sendTransaction = this.sendTransaction.bind(this);
    execute.getData = this.getData.bind(this);
    var displayName = this.displayName();
    contract[displayName] = execute;
    // contract[displayName][this.typeName()] = execute; // circular!!!!
};

module.exports = ContractMethod;
