
'use strict';

var protobuf = require('protobufjs');
var kernelDescriptor = require('./proto/kernel.proto.json')
var kernelRoot = protobuf.Root.fromJSON(kernelDescriptor);

var getHashFromHex = function(hex){
    return kernelRoot.Hash.create({'Value': Buffer.from(hex.replace('0x', ''), 'hex')});
}

var encodeTransaction = function(tx){
    return kernelRoot.Transaction.encode(tx).finish();
}

var getTransaction = function(from, to, methodName, params){
    var txn = {
        "From": getHashFromHex(from),
        "To": getHashFromHex(to),
        "MethodName": methodName,
        "Params": params
    }
    return kernelRoot.Transaction.create(txn);
}

module.exports = {
    getHashFromHex: getHashFromHex,
    getTransaction: getTransaction,
    encodeTransaction: encodeTransaction,
    Transaction: kernelRoot.Transaction,
    Hash: kernelRoot.Hash
};
