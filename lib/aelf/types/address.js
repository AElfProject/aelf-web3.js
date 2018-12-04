var f = require('./formatters.js');
var BaseType = require('./base');

var TypeAddress = function () {
    this._inputFormatter = f.formatInputAddress;
    this._outputFormatter = f.formatOutputAddress;
};

TypeAddress.prototype = new BaseType({});
TypeAddress.prototype.constructor = TypeAddress;

TypeAddress.prototype.isType = function (name) {
    return !!name.match(/^AElf\.Common\.Address$/);
};

module.exports = TypeAddress;
