
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
    var txn_data = encodeTransaction(raw_txn);
    var decodedTxn = kernelRoot.Transaction.decode(txn_data);
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

var getApproval =function (proposalHash, signature) {
    var approval = {
        'ProposalHash' : getHashFromHex(proposalHash),
        'Signature' : signature
    };

    return auth.Approval.create(approval);
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

var encodeApproval = function (approval, fieldNumber) {
    var value = auth.Approval.encode(approval).finish();
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
    getApproval: getApproval,
    encodeApproval:encodeApproval,
    Transaction: kernelRoot.Transaction,
    Hash: kernelRoot.Hash,
    Address: kernelRoot.Address,
    Authorization: auth.Authorization,
    Proposal: auth.Proposal,
    ProposalStatus: auth.ProposalStatus
};
