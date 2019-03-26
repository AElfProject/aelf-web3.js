
'use strict';

var utils = require('../utils/utils');
var protobuf = require('@aelfqueen/protobufjs');
var kernelDescriptor = require('./proto/kernel.proto.json');
var kernelRoot = protobuf.Root.fromJSON(kernelDescriptor);

var authDescriptor = require('./proto/auth.proto.json');
var auth = protobuf.Root.fromJSON(authDescriptor);

var crossChainDescriptor = require('./proto/crosschain.proto.json');
var crosschain = protobuf.Root.fromJSON(crossChainDescriptor);

var arrayBufferToHex = function (arrayBuffer)
{
    return Array.prototype.map.call(
        new Uint8Array(arrayBuffer),
        n => ("0" + n.toString(16)).slice(-2)
    ).join("");
}

var getRepForAddress = function(address){
    var message = kernelRoot.Address.fromObject(address);
    var hex = '';
    if(message.Value instanceof Buffer){
        hex = message.Value.toString('hex');
    }else{
        // Uint8Array
        hex = arrayBufferToHex(message.Value);
    }

    return utils.encodeAddressRep(hex);
};

var getAddressFromRep = function(rep){
    var hex = utils.decodeAddressRep(rep);
    return kernelRoot.Address.create({'Value': Buffer.from(hex.replace('0x', ''), 'hex')});
};

var getAddressObjectFromRep = function(rep){
    var output = kernelRoot.Address.toObject(getAddressFromRep(rep));
    return output;
};

var getRepForHash = function(hash){
    var message = kernelRoot.Address.fromObject(hash);
    var hex = '';
    if(message.Value instanceof Buffer){
        hex = message.Value.toString('hex');
    }else{
        // Uint8Array
        hex = arrayBufferToHex(message.Value);
    }

    return hex;
};

var getHashFromHex = function(hex){
    return kernelRoot.Hash.create({'Value': Buffer.from(hex.replace('0x', ''), 'hex')});
};

var getHashObjectFromHex = function(hex){
    return kernelRoot.Hash.toObject(getHashFromHex(hex));
};

var encodeTransaction = function(tx){
    return kernelRoot.Transaction.encode(tx).finish();
};

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
    getRepForAddress: getRepForAddress,
    getAddressFromRep: getAddressFromRep,
    getAddressObjectFromRep: getAddressObjectFromRep,
    getRepForHash: getRepForHash,
    getHashFromHex: getHashFromHex,
    getHashObjectFromHex: getHashObjectFromHex,
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
