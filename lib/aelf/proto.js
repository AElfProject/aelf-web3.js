
'use strict';

var utils = require('../utils/utils');
var protobuf = require('protobufjs');
var kernelDescriptor = require('./proto/kernel.proto.json');
var kernelRoot = protobuf.Root.fromJSON(kernelDescriptor);

var authDescriptor = require('./proto/auth.proto.json');
var auth = protobuf.Root.fromJSON(authDescriptor);

var getAddressFromRep = function(rep){
    var hex = utils.decodeAddressRep(rep);
    return kernelRoot.Address.create({'Value': Buffer.from(hex.replace('0x', ''), 'hex')});
}

var getHashFromHex = function(hex){
    return kernelRoot.Hash.create({'Value': Buffer.from(hex.replace('0x', ''), 'hex')});
}

var encodeTransaction = function(tx){
    return kernelRoot.Transaction.encode(tx).finish();
}

var getTransaction = function(from, to, methodName, params){
    var txn = {
        "From": getAddressFromRep(from),
        "To": getAddressFromRep(to),
        "MethodName": methodName,
        "Params": params
    }
    return kernelRoot.Transaction.create(txn);
}

var getReviewer = function(reviewer){
    return auth.Reviewer.create(reviewer);
};

var getAuthorization = function (decided_threshold, proposer_threshold, reviewers) {
    var authorization = {
        "ExecutionThreshold" : decided_threshold,
        "ProposerThreshold" : proposer_threshold,
        "Reviewers" : reviewers
    };
    return auth.Authorization.create(authorization);
};

module.exports = {
    getAddressFromRep: getAddressFromRep,
    getHashFromHex: getHashFromHex,
    getTransaction: getTransaction,
    getAuthorization: getAuthorization,
    getReviewer: getReviewer,
    encodeTransaction: encodeTransaction,
    Transaction: kernelRoot.Transaction,
    Hash: kernelRoot.Hash,
    Address: kernelRoot.Address,
    Authorization: auth.Authorization
};
