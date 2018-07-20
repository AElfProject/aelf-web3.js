var f = require('./formatters');

/**
 * SolidityType prototype is used to encode/decode solidity params of certain type
 */
var BaseType = function (config) {
    this._inputFormatter = config.inputFormatter;
    this._outputFormatter = config.outputFormatter;
};

/**
 * Should be used to determine if this SolidityType do match given name
 *
 * @method isType
 * @param {String} name
 * @return {Bool} true if type match this SolidityType, otherwise false
 */
BaseType.prototype.isType = function (name) {
    throw "this method should be overrwritten for type " + name;
};

/**
 * Should be used to encode the value
 *
 * @method encode
 * @param {Object} value
 * @param {String} name
 * @return {String} encoded value
 */
BaseType.prototype.encode = function (value, fieldNumber) {
    return this._inputFormatter(value, fieldNumber);
};

/**
 * Should be used to decode value from bytes
 *
 * @method decode
 * @param {String} bytes
 * @param {Number} offset in bytes
 * @param {String} name type name
 * @returns {Object} decoded value
 */
BaseType.prototype.decode = function (bytes, name) {
    return this._outputFormatter(bytes, name);
};

module.exports = BaseType;
