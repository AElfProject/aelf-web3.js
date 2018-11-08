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
 * @file formatters.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var protobuf = require('protobufjs');
var proto = require('../proto.js')


/**
 * Formats input bool to bytes
 *
 * @method formatInputBool
 * @param {Boolean}
 * @returns {Buffer}
 */
var formatInputBool = function (value, fieldNumber) {
    var w = new protobuf.BufferWriter();
    // Tag
    w.uint32(fieldNumber << 3);
    // Data
    w.bool(value);
    return w.finish();
};

/**
 * Formats input int to bytes
 *
 * @method formatInputInt
 * @param {number} value that needs to be formatted
 * @returns {Buffer}
 */
var formatInputInt = function (value, fieldNumber) {
    var w = new protobuf.BufferWriter();
    // Tag
    w.uint32(fieldNumber << 3);
    // Data
    w.sint32(value);
    return w.finish();
};

/**
 * Formats input uint32 to bytes
 *
 * @method formatInputUInt
 * @param {number}
 * @returns {BigNumeber}
 */
var formatInputUInt = function (value, fieldNumber) {
    var w = new protobuf.BufferWriter();
    // Tag
    w.uint32(fieldNumber << 3);
    // Data
    w.uint32(value);
    return w.finish();
};

/**
 * Formats input int64 to bytes
 *
 * @method formatInputLong
 * @param {Long|number} value
 * @returns {Buffer}
 */
var formatInputLong = function (value, fieldNumber) {
    var w = new protobuf.BufferWriter();
    // Tag
    w.uint32(fieldNumber << 3);
    // Data
    w.int64(value);
    return w.finish();
};

/**
 * Formats input uint64 to bytes
 *
 * @method formatInputULong
 * @param {Long|number} value
 * @returns {Buffer}
 */
var formatInputULong = function (value, fieldNumber) {
    var w = new protobuf.BufferWriter();
    // Tag
    w.uint32(fieldNumber << 3);
    // Data
    w.uint64(value);
    return w.finish();
};

/**
 * Formats input value to byte representation of string
 *
 * @method formatInputString
 * @param {String}
 * @returns {Buffer}
 */
var formatInputString = function (value, fieldNumber) {
    var w = new protobuf.BufferWriter();
    // Tag
    w.uint32(fieldNumber << 3 | 2);
    // Data
    w.string(value);
    return w.finish();
};

/**
 * Formats input bytes to bytes
 *
 * @method formatInputBytes
 * @param {String} hex
 * @returns {Buffer}
 */
var formatInputBytes = function (hex, fieldNumber) {
    var bytes = Buffer.from(hex, "hex")
    var w = new protobuf.BufferWriter();
    // Tag
    w.uint32(fieldNumber << 3 | 2);
    // Data
    w.bytes(bytes);
    return w.finish();
};

/**
 * Formats input hash to bytes
 *
 * @method formatInputHash
 * @param {String} hex
 * @returns {Buffer}
 */
var formatInputHash = function (hex, fieldNumber) {
    var hash = proto.getHashFromHex(hex);
    var value = proto.Hash.encode(hash).finish();
    var w = new protobuf.BufferWriter();
    // Tag
    w.uint32(fieldNumber << 3 | 2);
    // Data
    w.bytes(value);
    return w.finish();
};

/**
 * Formats output bytes to bool
 *
 * @method formatOutputBool
 * @param {Buffer} bytes
 * @returns {Boolean}
 */
var formatOutputBool = function (bytes) {
    var r = new protobuf.BufferReader(bytes);
    // Tag
    r.uint32();
    return r.bool();
};

/**
 * Formats output bytes to int
 *
 * @method formatOutputInt
 * @param {Buffer} bytes
 * @returns {number}
 */
var formatOutputInt = function (bytes) {
    var r = new protobuf.BufferReader(bytes);
    // Tag
    r.uint32();
    return r.sint32();
};

/**
 * Formats output bytes to uint
 *
 * @method formatOutputUInt
 * @param {Buffer} bytes
 * @returns {number}
 */
var formatOutputUInt = function (bytes) {
    var r = new protobuf.BufferReader(bytes);
    // Tag
    r.uint32();
    return r.uint32();
};

/**
 * Formats output bytes to int64
 *
 * @method formatOutputLong
 * @param {Buffer} bytes
 * @returns {Long}
 */
var formatOutputLong = function (bytes) {
    var r = new protobuf.BufferReader(bytes);
    // Tag
    r.uint32();
    return r.sint64();
};

/**
 * Formats output bytes to uint64
 *
 * @method formatOutputULong
 * @param {Buffer} bytes
 * @returns {Long}
 */
var formatOutputULong = function (bytes) {
    var r = new protobuf.BufferReader(bytes);
    // Tag
    r.uint32();
    return r.uint64();
};



/**
 * Formats output bytes to bytes
 *
 * @method formatOutputBytes
 * @param {Buffer} bytes
 * @returns {Buffer}
 */
var formatOutputBytes = function (bytes) {
    var r = new protobuf.BufferReader(bytes);
    // Tag
    r.uint32();
    return r.bytes();
};

/**
 * Formats output Hash to bytes
 *
 * @method formatOutputHash
 * @param {Buffer} bytes
 * @returns {Hash}
 */
var formatOutputHash = function (bytes) {
    var r = new protobuf.BufferReader(bytes);
    // Tag
    r.uint32();
    return proto.Hash.decode(r.bytes());
};

/**
 * Formats output bytes to string
 *
 * @method formatOutputString
 * @param {Buffer} bytes
 * @returns {String}
 */
var formatOutputString = function (bytes) {
    var r = new protobuf.BufferReader(bytes);
    // Tag
    r.uint32();
    return r.string();
};

module.exports = {
    formatInputBool: formatInputBool,
    formatInputInt: formatInputInt,
    formatInputUInt: formatInputUInt,
    formatInputLong: formatInputLong,
    formatInputULong: formatInputULong,
    formatInputBytes: formatInputBytes,
    formatInputString: formatInputString,
    formatInputHash: formatInputHash,
    formatOutputBool: formatOutputBool,
    formatOutputInt: formatOutputInt,
    formatOutputUInt: formatOutputUInt,
    formatOutputLong: formatOutputLong,
    formatOutputULong: formatOutputULong,
    formatOutputBytes: formatOutputBytes,
    formatOutputString: formatOutputString,
    formatOutputHash: formatOutputHash,
};
