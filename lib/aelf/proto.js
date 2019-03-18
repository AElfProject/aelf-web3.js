
'use strict';

var utils = require('../utils/utils');
var protobuf = require('@aelfqueen/protobufjs');
var kernelDescriptor = require('./proto/kernel.proto.json');
var kernelRoot = protobuf.Root.fromJSON(kernelDescriptor);

var authDescriptor = require('./proto/auth.proto.json');
var auth = protobuf.Root.fromJSON(authDescriptor);

var crossChainDescriptor = require('./proto/crosschain.proto.json');
var crosschain = protobuf.Root.fromJSON(crossChainDescriptor);

var getAddressFromRep = function(rep){
    var hex = utils.decodeAddressRep(rep);
    return kernelRoot.Address.create({'Value': Buffer.from(hex.replace('0x', ''), 'hex')});
};

var getHashFromHex = function(hex){
    return kernelRoot.Hash.create({'Value': Buffer.from(hex.replace('0x', ''), 'hex')});
};

var encodeTransaction = function(tx){
    return kernelRoot.Transaction.encode(tx).finish();
};

var getTransaction = function(from, to, methodName, params){
    var parsedTime = Date.parse(new Date(Date.now()).toISOString());
    var txn = {
        "From": getAddressFromRep(from),
        "To": getAddressFromRep(to),
        "MethodName": methodName,
        "Params": params,
        "Time" : {
            seconds: Math.floor(parsedTime/1000),
            // this nanos is Microsecond
            nanos: (parsedTime % 1000) * 1000
        }
    };
    return kernelRoot.Transaction.create(txn);
};

var getMsigTransaction = function(from, to, methodName, params){
    var parsedTime = Date.parse(new Date(Date.now()).toISOString());
    var txn = {
        "From": getAddressFromRep(from),
        "To": getAddressFromRep(to),
        "MethodName": methodName,
        "Params": params,
        "Type" : kernelRoot.TransactionType.MsigTransaction,
        "Time" : {
            seconds: Math.floor(parsedTime/1000),
            nanos: (parsedTime % 1000) * 1000
        }
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

var getSideChainInfo = function (locked_token_amount, indexing_price, pairs, code, proposer) {
    var sideChainInfo ={
        'IndexingPrice': indexing_price,
        'LockedTokenAmount': locked_token_amount,
        'ResourceBalances': pairs,
        'ContractCode': code,
        'Proposer': getAddressFromRep(proposer),
        'SideChainStatus': crosschain.SideChainStatus.Apply
    };
    return crosschain.SideChainInfo.create(sideChainInfo);
};

var getBalance = function (resource_balance) {
    var pair = {
        'Type' : resource_balance.Type,
        'Amount' : resource_balance.Amount
    };
    return crosschain.ResourceTypeBalancePair.create(pair);
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

var encodeSideChainInfo =function (sideChainInfo, fieldNumber) {
    var value = crosschain.SideChainInfo.encode(sideChainInfo).finish();
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
    getSideChainInfo: getSideChainInfo,
    getBalance: getBalance,
    encodeSideChainInfo: encodeSideChainInfo,
    Transaction: kernelRoot.Transaction,
    Hash: kernelRoot.Hash,
    Address: kernelRoot.Address,
    Authorization: auth.Authorization,
    Proposal: auth.Proposal,
    ProposalStatus: auth.ProposalStatus,
    SideChainInfo: crosschain.SideChainInfo,
    SideChainStatus: crosschain.SideChainStatus,
    ResourceTypeBalancePair: crosschain.ResourceTypeBalancePair
};
