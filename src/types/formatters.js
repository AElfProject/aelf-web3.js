/**
 * @file formatters for types
 * @author atom-yang
 */

import * as protobuf from '@aelfqueen/protobufjs/light';
import coder from './coder';
import * as proto from '../util/proto';
// import Buffer from 'buffer';

/**
 * Formats input bool to bytes
 *
 * @param {Boolean} value
 * @param {Number} fieldNumber
 * @returns {Uint8Array | Buffer | void | never}
 */
export const formatInputBool = (value, fieldNumber) => {
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3);
  // Data
  writer.bool(value);
  return writer.finish();
};

/**
 * Formats input int to bytes
 *
 * @method formatInputInt
 * @param {number} value that needs to be formatted
 * @param {Number} fieldNumber
 * @returns {Buffer}
 */
export const formatInputInt = (value, fieldNumber) => {
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3);
  // Data
  writer.sint32(value);
  return writer.finish();
};

/**
 * Formats input uint32 to bytes
 *
 * @method formatInputUInt
 * @param {Number} value that needs to be formatted
 * @param {Number} fieldNumber
 * @returns {BigNumber}
 */
export const formatInputUInt = (value, fieldNumber) => {
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3);
  // Data
  writer.uint32(value);
  return writer.finish();
};

/**
 * Formats input int64 to bytes
 *
 * @method formatInputLong
 * @param {Long|number} value
 * @param {Number} fieldNumber
 * @returns {Buffer}
 */
export const formatInputLong = (value, fieldNumber) => {
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3);
  // Data
  writer.int64(value);
  return writer.finish();
};

/**
 * Formats input uint64 to bytes
 *
 * @method formatInputULong
 * @param {Long|number} value
 * @param {Number} fieldNumber
 * @returns {Buffer}
 */
export const formatInputULong = (value, fieldNumber) => {
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3);
  // Data
  writer.uint64(value);
  return writer.finish();
};

/**
 * Formats input value to byte representation of string
 *
 * @method formatInputString
 * @param {String} value
 * @param {Number} fieldNumber
 * @returns {Buffer}
 */
export const formatInputString = (value, fieldNumber) => {
  const bytes = Buffer.from(value, 'utf8');
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3 | 2);
  // Data
  writer.bytes(bytes);
  return writer.finish();
};

/**
 * Formats input bytes to bytes
 *
 * @method formatInputBytes
 * @param {String} hex
 * @param {Number} fieldNumber
 * @returns {Buffer}
 */
export const formatInputBytes = (hex, fieldNumber) => {
  const bytes = Buffer.from(hex, 'hex');
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3 | 2);
  // Data
  writer.bytes(bytes);
  return writer.finish();
};

/**
 * Formats input hash to bytes
 *
 * @method formatInputHash
 * @param {String} hex
 * @param {Number} fieldNumber
 * @returns {Buffer}
 */
export const formatInputHash = (hex, fieldNumber) => {
  const hash = proto.getHashFromHex(hex);
  const value = proto.Hash.encode(hash).finish();
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3 | 2);
  // Data
  writer.bytes(value);
  return writer.finish();
};


/**
 * Formats input authorization info to bytes
 * @param auth
 * @param fieldNumber
 * @returns {Buffer}
 */
export const formatInputAuthorization = (auth, fieldNumber) => {
  const reviewers = auth.Reviewers.map(v => proto.getReviewer(v));

  const a = proto.getAuthorization(auth.ExecutionThreshold, auth.ProposerThreshold, reviewers);
  const value = proto.Authorization.encode(a).finish();
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3 | 2);
  // Data
  writer.bytes(value);
  return writer.finish();
};


/**
 * Formats input proposal info to bytes
 * @param proposal
 * @param fieldNumber
 * @returns {Buffer}
 */
export function formatInputProposal(proposal, fieldNumber) {
  const {
    TxnData,
    MultiSigAccount,
    Name,
    ExpiredTime,
    Proposer
  } = proposal;
  const {
    MethodAbi,
    From,
    To,
    MethodName,
    Params
  } = TxnData;
  const types = MethodAbi.Params.map(i => i.Type);
  // const args = Array.prototype.slice.call(Params).filter(param => param !== undefined);
  // todo: decide whether to remove filter or not
  const args = Array.prototype.slice.call(Params);
  const rawTxn = proto.getMsigTransaction(From, To, MethodName, coder.encodeParams(types, args));
  const p = proto.getProposal(MultiSigAccount, Name, rawTxn, ExpiredTime, Proposer);
  return proto.encodeProposal(p, fieldNumber);
}

/**
 * Formats input approval info to bytes
 * @param approval
 * @param fieldNumber
 * @returns {*}
 */
export const formatInputApproval = (approval, fieldNumber) => {
  const { ProposalHash, Signature } = approval;
  const rawApproval = proto.getApproval(ProposalHash, Signature);
  return proto.encodeApproval(rawApproval, fieldNumber);
};

/**
 * Formats input side chain info info to bytes
 * @param sideChainInfo
 * @param fieldNumber
 * @returns {*}
 */
export const formatInputSideChainInfo = (sideChainInfo, fieldNumber) => {
  // eslint-disable-next-line max-len
  const {
    ResourceBalances,
    ContractCode,
    LockedTokenAmount,
    IndexingPrice,
    Proposer
  } = sideChainInfo;
  const pairs = ResourceBalances.map(v => proto.getBalance(v));
  const code = Buffer.from(ContractCode.replace('0x', ''), 'hex');
  // eslint-disable-next-line max-len
  const rawSideChainInfo = proto.getSideChainInfo(LockedTokenAmount, IndexingPrice, pairs, code, Proposer);
  return proto.encodeSideChainInfo(rawSideChainInfo, fieldNumber);
};

/**
 * Formats input merkle path info to bytes
 * @param merklepath
 * @param fieldNumber
 * @returns {Uint8Array | Buffer | void | never}
 */
export const formatInputMerklePath = (merklePath, fieldNumber) => {
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3 | 2);
  // Data
  writer.bytes(Buffer.from(merklePath.replace('0x', ''), 'hex'));
  return writer.finish();
};


/**
 * Formats input Address to bytes
 *
 * @method formatInputAddress
 * @param {String} rep
 * @param {Number} fieldNumber
 * @returns {Buffer}
 */
export const formatInputAddress = (rep, fieldNumber) => {
  const address = proto.getAddressFromRep(rep);
  const value = proto.Address.encode(address).finish();
  const writer = new protobuf.BufferWriter();
  // Tag
  writer.uint32(fieldNumber << 3 | 2);
  // Data
  writer.bytes(value);
  return writer.finish();
};

/**
 * Formats output bytes to bool
 *
 * @method formatOutputBool
 * @param {Buffer} bytes
 * @returns {Boolean}
 */
export const formatOutputBool = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return reader.bool();
};

/**
 * Formats output bytes to int
 *
 * @method formatOutputInt
 * @param {Buffer} bytes
 * @returns {number}
 */
export const formatOutputInt = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return reader.sint32();
};

/**
 * Formats output bytes to uint
 *
 * @method formatOutputUInt
 * @param {Buffer} bytes
 * @returns {number}
 */
export const formatOutputUInt = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return reader.uint32();
};

/**
 * Formats output bytes to int64
 *
 * @method formatOutputLong
 * @param {Buffer} bytes
 * @returns {Long}
 */
export const formatOutputLong = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return reader.sint64();
};

/**
 * Formats output bytes to uint64
 *
 * @method formatOutputULong
 * @param {Buffer} bytes
 * @returns {Long}
 */
export const formatOutputULong = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return reader.uint64();
};


/**
 * Formats output bytes to bytes
 *
 * @method formatOutputBytes
 * @param {Buffer} bytes
 * @returns {Buffer}
 */
export const formatOutputBytes = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return reader.bytes();
};

/**
 * Formats output Address to bytes
 *
 * @method formatOutputAddress
 * @param {Buffer} bytes
 * @returns {Address}
 */
export const formatOutputAddress = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return proto.Address.decode(reader.bytes());
};

/**
 * Formats output Approval to bytes
 *
 * @method formatOutputAddress
 * @param {Buffer} bytes
 * @returns {Address}
 */
export const formatOutputApproval = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return proto.Approval.decode(reader.bytes());
};

/**
 * Formats output Hash to bytes
 *
 * @method formatOutputHash
 * @param {Buffer} bytes
 * @returns {Hash}
 */
export const formatOutputHash = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return proto.Hash.decode(reader.bytes());
};


/**
 * Formats output bytes to authorization
 * @param bytes
 */
export const formatOutputAuthorization = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return proto.Authorization.decode(reader.bytes());
};

/**
 * Formats output bytes to authorization
 * @param bytes
 */
export const formatOutputProposal = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return proto.Proposal.decode(reader.bytes());
};

export const formatOutputSideChainInfo = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return proto.SideChainInfo.decode(reader.bytes());
};

/**
 * Formats output bytes to string
 *
 * @method formatOutputString
 * @param {Buffer} bytes
 * @returns {String}
 */
export const formatOutputString = bytes => {
  const reader = new protobuf.BufferReader(bytes);
  // Tag
  reader.uint32();
  return reader.string();
};
