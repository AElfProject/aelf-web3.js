
'use strict';

var utils = require('../utils/utils');
var protobuf = require('protobufjs');
var kernelDescriptor = require('./proto/kernel.proto.json');
var kernelRoot = protobuf.Root.fromJSON(kernelDescriptor);

var authDescriptor = require('./proto/auth.proto.json');
var auth = protobuf.Root.fromJSON(authDescriptor);

var getAddressFromRep = function(rep){
    var hex = utils.decodeAddressRep(rep);
    console.log(rep, ' ', hex);
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
    };
    return kernelRoot.Transaction.create(txn);
};

var getMsigTransaction = function(from, to, methodName, params){
    var txn = {
        "From": getAddressFromRep(from),
        "To": getAddressFromRep(to),
        "MethodName": methodName,
        "Params": params,
        "Type" : kernelRoot.TransactionType.MsigTransaction
    };
    return kernelRoot.Transaction.create(txn);
};

var getReviewer = function(reviewer){
    var value = {
        'PubKey': Buffer.from(reviewer.PubKey.replace('0x', ''), 'hex'),
        'Weight': reviewer.Weight
    };
    return auth.Reviewer.create(value);
};

var getAuthorization = function (decided_threshold, proposer_threshold, reviewers) {
    var authorization = {
        "ExecutionThreshold" : decided_threshold,
        "ProposerThreshold" : proposer_threshold,
        "Reviewers" : reviewers
    };
    return auth.Authorization.create(authorization);
};

var getProposal = function (multisig_account, proposal_name, raw_txn, expired_time, proposer) {

    console.log('raw_txn - ', raw_txn);
    var txn_data = encodeTransaction(raw_txn);
    var decodedTxn = kernelRoot.Transaction.decode(txn_data);
    console.log('txn from - ', decodedTxn.From);
    console.log('txn data length - ',  txn_data.length);
    console.log('proposal_name - ', proposal_name);
    console.log('txn_data - ', txn_data.toString('hex'));
    console.log('expired_time - ',(new Date(expired_time).getTime())/ 1000);
    console.log('proposer - ', proposer);
    var proposal = {
        "MultiSigAccount" : getAddressFromRep(multisig_account),
        "Name" : proposal_name,
        "TxnData" : txn_data,
        "ExpiredTime" : (new Date(expired_time).getTime())/ 1000,
        "Status" : auth.ProposalStatus.ToBeDecided,
        "Proposer" : getAddressFromRep(proposer)
    };
    return auth.Proposal.create(proposal);
};

var encodeProposal =function (proposal, fieldNumber) {
    var value = auth.Proposal.encode(proposal).finish();
    var w = new protobuf.BufferWriter();
    // Tag
    w.uint32(fieldNumber << 3 | 2);
    // Data
    w.bytes(value);
    return w.finish();
};

module.exports = {
    getAddressFromRep: getAddressFromRep,
    getHashFromHex: getHashFromHex,
    getTransaction: getTransaction,
    getMsigTransaction: getMsigTransaction,
    getAuthorization: getAuthorization,
    getReviewer: getReviewer,
    encodeTransaction: encodeTransaction,
    getProposal: getProposal,
    encodeProposal : encodeProposal,
    Transaction: kernelRoot.Transaction,
    Hash: kernelRoot.Hash,
    Address: kernelRoot.Address,
    Authorization: auth.Authorization,
    Proposal: auth.Proposal,
    ProposalStatus: auth.ProposalStatus
};
