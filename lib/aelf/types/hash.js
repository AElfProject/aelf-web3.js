var f = require('./formatters.js');
var BaseType = require('./base');

var TypeHash = function () {
    this._inputFormatter = f.formatInputHash;
    this._outputFormatter = f.formatOutputHash;
};

TypeHash.prototype = new BaseType({});
TypeHash.prototype.constructor = TypeHash;

TypeHash.prototype.isType = function (name) {
    return !!name.match(/^AElf\.Kernel\.Hash$/);
};

module.exports = TypeHash;
