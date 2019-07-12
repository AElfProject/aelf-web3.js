/**
 * @file proto utils
 * @author atom-yang
 */
import * as protobuf from '@aelfqueen/protobufjs/light';
import kernelDescriptor from '../../proto/kernel.proto.json';
// keep auth and cross chain proto in project for backup
import authDescriptor from '../../proto/auth.proto.json';
import crossChainDescriptor from '../../proto/crosschain.proto.json';
import * as utils from './utils';

export const kernelRootProto = protobuf.Root.fromJSON(kernelDescriptor);
export const authProto = protobuf.Root.fromJSON(authDescriptor);
export const crossChainProto = protobuf.Root.fromJSON(crossChainDescriptor);
/* eslint-disable no-unused-vars */

export const {
  Transaction,
  Hash,
  Address
} = kernelRootProto;

export const {
  Approval,
  Authorization,
  Proposal,
  ProposalStatus
} = authProto;

export const {
  SideChainInfo,
  SideChainStatus,
  ResourceTypeBalancePair
} = crossChainProto;

/**
 * arrayBuffer To Hex
 *
 * @alias module:AElf/pbUtils
 * @param {Buffer} arrayBuffer arrayBuffer
 * @return {string} hex string
 */
export const arrayBufferToHex = arrayBuffer => Array.prototype.map.call(
  new Uint8Array(arrayBuffer),
  n => (`0${n.toString(16)}`).slice(-2)
).join('');

/**
 * get hex rep From Address
 *
 * @alias module:AElf/pbUtils
 * @param {protobuf} address kernel.Address
 * @return {string} hex rep of address
 */
export const getRepForAddress = address => {
  const message = kernelRootProto.Address.fromObject(address);
  let hex = '';
  if (message.value instanceof Buffer) {
    hex = message.value.toString('hex');
  } else {
    // Uint8Array
    hex = arrayBufferToHex(message.value);
  }
  return utils.encodeAddressRep(hex);
};

/**
 * get address From hex rep
 *
 * @alias module:AElf/pbUtils
 * @param {string} rep address
 * @return {protobuf} address kernel.Address
 */
export const getAddressFromRep = rep => {
  const hex = utils.decodeAddressRep(rep);
  return kernelRootProto.Address.create({
    value: Buffer.from(hex.replace('0x', ''), 'hex')
  });
};

/**
 * get address From hex rep
 *
 * @alias module:AElf/pbUtils
 * @param {string} rep address
 * @return {protobuf} address kernel.Address
 */
export const getAddressObjectFromRep = rep => kernelRootProto.Address.toObject(getAddressFromRep(rep));

/**
 * get hex rep From hash
 *
 * @alias module:AElf/pbUtils
 * @param {protobuf} hash kernel.Hash
 * @return {string} hex rep
 */
export const getRepForHash = hash => {
  const message = kernelRootProto.Address.fromObject(hash);
  let hex = '';
  if (message.value instanceof Buffer) {
    hex = message.value.toString('hex');
  } else {
    // Uint8Array
    hex = arrayBufferToHex(message.value);
  }
  return hex;
};

/**
 * get Hash From Hex
 *
 * @alias module:AElf/pbUtils
 * @param {string} hex string
 * @return {protobuf} kernel.Hash
 */
export const getHashFromHex = hex => kernelRootProto.Hash.create({
  value: Buffer.from(hex.replace('0x', ''), 'hex')
});

/**
 * get Hash Object From Hex
 *
 * @alias module:AElf/pbUtils
 * @param {string} hex string
 * @return {Object} kernel.Hash Hash ot Object
 */
export const getHashObjectFromHex = hex => kernelRootProto.Hash.toObject(getHashFromHex(hex));

/**
 * encode Transaction to protobuf type
 *
 * @alias module:AElf/pbUtils
 * @param {Object} tx object
 * @return {protobuf} kernel.Transaction
 */
export const encodeTransaction = tx => kernelRootProto.Transaction.encode(tx).finish();

/**
 * get Transaction
 *
 * @alias module:AElf/pbUtils
 * @param {string} from
 * @param {string} to
 * @param {string} methodName
 * @param {string} params
 * @return {protobuf} kernel.Transaction
 */
export const getTransaction = (from, to, methodName, params) => {
  const txn = {
    from: getAddressFromRep(from),
    to: getAddressFromRep(to),
    methodName,
    params
  };
  return kernelRootProto.Transaction.create(txn);
};

/**
 * get MultiSign Transaction
 *
 * @alias module:AElf/pbUtils
 * @param {string} from
 * @param {string} to
 * @param {string} methodName
 * @param {string} params
 * @return {protobuf} kernel.Transaction
 */
export const getMsigTransaction = (from, to, methodName, params) => {
  const txn = {
    from: getAddressFromRep(from),
    to: getAddressFromRep(to),
    methodName,
    params,
    type: kernelRootProto.TransactionType.MsigTransaction
  };
  return kernelRootProto.Transaction.create(txn);
};

/**
 * get Reviewer, useless temporarily
 *
 * @alias module:AElf/pbUtils
 * @param {Object} reviewer
 * @return {protobuf} auth.Reviewer
 */
const getReviewer = reviewer => {
  const value = {
    PubKey: Buffer.from(reviewer.PubKey.replace('0x', ''), 'hex'),
    Weight: reviewer.Weight
  };
  return authProto.Reviewer.create(value);
};

/**
 * get Authorization，useless temporarily
 *
 * @alias module:AElf/pbUtils
 * @param {string} decidedThreshold
 * @param {string} proposerThreshold
 * @param {string} reviewers
 * @return {protobuf} auth.Authorization
 */
const getAuthorization = (decidedThreshold, proposerThreshold, reviewers) => {
  const authorization = {
    ExecutionThreshold: decidedThreshold,
    ProposerThreshold: proposerThreshold,
    Reviewers: reviewers
  };
  return authProto.Authorization.create(authorization);
};

/**
 * get Proposal，useless temporarily
 *
 * @alias module:AElf/pbUtils
 * @param {string} multisigAccount
 * @param {string} proposalName
 * @param {protobuf} rawTxn
 * @param {string} expiredTime
 * @param {protobuf} proposer kernel.Address
 * @return {protobuf} auth.Proposal
 */
const getProposal = (multisigAccount, proposalName, rawTxn, expiredTime, proposer) => {
  const txnData = encodeTransaction(rawTxn);
  const proposal = {
    MultiSigAccount: getAddressFromRep(multisigAccount),
    Name: proposalName,
    TxnData: txnData,
    ExpiredTime: (new Date(expiredTime).getTime()) / 1000,
    Status: authProto.ProposalStatus.ToBeDecided,
    Proposer: getAddressFromRep(proposer)
  };
  return authProto.Proposal.create(proposal);
};

/**
 * get Approval，useless temporarily
 *
 * @alias module:AElf/pbUtils
 * @param {string} proposalHash
 * @param {string} signature
 * @return {protobuf} auth.Approval
 */
const getApproval = (proposalHash, signature) => {
  const approval = {
    ProposalHash: getHashFromHex(proposalHash),
    Signature: signature
  };

  return authProto.Approval.create(approval);
};

/**
 * get Side Chain Info，useless temporarily
 *
 * @alias module:AElf/pbUtils
 * @param {string} lockedTokenAmount
 * @param {string} indexingPrice
 * @param {string} pairs
 * @param {string} code
 * @param {string} proposer hex string
 * @return {protobuf} crosschain.SideChainInfo
 */
const getSideChainInfo = (lockedTokenAmount, indexingPrice, pairs, code, proposer) => {
  const sideChainInfo = {
    IndexingPrice: indexingPrice,
    LockedTokenAmount: lockedTokenAmount,
    ResourceBalances: pairs,
    ContractCode: code,
    Proposer: getAddressFromRep(proposer),
    SideChainStatus: crossChainProto.SideChainStatus.Apply
  };
  return crossChainProto.SideChainInfo.create(sideChainInfo);
};

/**
 * get balance，useless temporarily
 *
 * @alias module:AElf/pbUtils
 * @param {object} resourceBalance
 * @return {protobuf} crosschain.ResourceTypeBalancePair
 */
const getBalance = ({ resourceBalance: { Type, Amount } }) => {
  const pair = {
    Type,
    Amount
  };
  return crossChainProto.ResourceTypeBalancePair.create(pair);
};

/**
 * encode Proposal，useless temporarily
 *
 * @alias module:AElf/pbUtils
 * @param {object} proposal
 * @param {number} fieldNumber
 * @return {Buffer} buffer
 */
const encodeProposal = (proposal, fieldNumber) => {
  const value = authProto.Proposal.encode(proposal).finish();
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3 | 2);
  // Data
  writer.bytes(value);
  return writer.finish();
};

/**
 * encode Side Chain Info，useless temporarily
 *
 * @alias module:AElf/pbUtils
 * @param {object} sideChainInfo
 * @param {number} fieldNumber
 * @return {Buffer} buffer
 */
const encodeSideChainInfo = (sideChainInfo, fieldNumber) => {
  const value = crossChainProto.SideChainInfo.encode(sideChainInfo).finish();
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3 | 2);
  // Data
  writer.bytes(value);
  return writer.finish();
};

/**
 * encode Approval，useless temporarily
 *
 * @alias module:AElf/pbUtils
 * @param {object} approval
 * @param {number} fieldNumber
 * @return {Buffer} buffer
 */
const encodeApproval = (approval, fieldNumber) => {
  const value = authProto.Approval.encode(approval).finish();
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3 | 2);
  // Data
  writer.bytes(value);
  return writer.finish();
};

/* eslint-enable */
