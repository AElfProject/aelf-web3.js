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
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

'use strict';
// var protobuf = require('@aelfqueen/protobufjs');
var descriptor = require("@aelfqueen/protobufjs/ext/descriptor");
// var abiDescriptor = require('./proto/abi.proto.json')
// var ModuleMessage = protobuf.Root.fromJSON(abiDescriptor).Module;

var inputAddressFormatter = function (address) {
    // if (address.startsWith('ELF_')) {
    //     var parts = address.split('_');
    //     var b58rep = parts[parts.length - 1];
    //     return base58check.decode(b58rep, 'hex');
    // }
    // throw new Error('invalid address');
    return address;
};

// var outputAbiFormatter = function (result) {
//     // var root = protobuf.Root.fromJSON(abiDescriptor);
//     // var ModuleMessage = root.Module;
//     var buffer = Buffer.from(result.Abi.replace('0x', ''), 'hex');
//     result.abi = ModuleMessage.decode(buffer);
//     return result.abi;
// };

/**
 * @param {String} result base64 representation of serialized FileDescriptorSet
 * @returns {FileDescriptorSet} decoded FileDescriptorSet message
 */
var outputFileDescriptorSetFormatter = function (result) {
    var buffer = Buffer.from(result, 'base64');
    var decoded = descriptor.FileDescriptorSet.decode(buffer);
    return decoded;
};

module.exports = {
    inputAddressFormatter: inputAddressFormatter,
    // outputAbiFormatter: outputAbiFormatter,
    outputFileDescriptorSetFormatter: outputFileDescriptorSetFormatter
};

