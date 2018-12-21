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
 * @file coder.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var f = require('./formatters');

var TypeBool = require('./bool.js');
var TypeInt = require('./int.js');
var TypeUInt = require('./uint.js');
var TypeLong = require('./long.js');
var TypeULong = require('./ulong.js');
var TypeBytes = require('./bytes.js');
var TypeString = require('./string.js');
var TypeAddress = require('./address.js');
var TypeHash = require('./hash.js');
var TypeAuthorization = require('./authorization.js');
var TypeProposal = require('./proposal');
var TypeApproval = require('./approval');
var TypeSideChainInfo = require('./sidechaininfo');
var TypeMerklePath = require('./merklepath');

/**
 * SolidityCoder prototype should be used to encode/decode solidity params of any type
 */
var Coder = function (types) {
    this._types = types;
};

/**
 * This method should be used to transform type to SolidityType
 *
 * @method _requireType
 * @param {String} type
 * @returns {SolidityType}
 * @throws {Error} throws if no matching type is found
 */
Coder.prototype._requireType = function (type) {
    var fieldType = this._types.filter(function (t) {
        return t.isType(type);
    })[0];

    if (!fieldType) {
        throw Error('invalid solidity type!: ' + type);
    }

    return fieldType;
};

/**
 * Should be used to encode plain param
 *
 * @method encodeParam
 * @param {String} type
 * @param {Object} plain param
 * @return {String} encoded plain param
 */
Coder.prototype.encodeParam = function (type, param) {
    return this.encodeParams([type], [param]);
};

/**
 * Should be used to encode list of params
 *
 * @method encodeParams
 * @param {Array} types
 * @param {Array} params
 * @return {String} encoded list of params
 */
Coder.prototype.encodeParams = function (types, params) {
    var fieldTypes = this.getFieldTypes(types);

    var encodeds = fieldTypes.map(function (fieldType, index) {
        return fieldType.encode(params[index], index + 1);
    });

    return Buffer.concat(encodeds);
};

/**
 * Should be used to decode bytes to plain param
 *
 * @method decodeParam
 * @param {String} type
 * @param {String} bytes
 * @return {Object} plain param
 */
Coder.prototype.decodeParam = function (type, bytes) {
    var fieldType = this.getFieldTypes([type])[0];
    return fieldType.decode(bytes, type);
};

Coder.prototype.getFieldTypes = function (types) {
    var self = this;
    return types.map(function (type) {
        return self._requireType(type);
    });
};

var coder = new Coder([
    new TypeBool(),
    new TypeInt(),
    new TypeUInt(),
    new TypeLong(),
    new TypeULong(),
    new TypeBytes(),
    new TypeString(),
    new TypeAddress(),
    new TypeHash(),
    new TypeAuthorization(),
    new TypeProposal(),
    new TypeApproval(),
    new TypeSideChainInfo(),
    new TypeMerklePath()
]);

module.exports = coder;
