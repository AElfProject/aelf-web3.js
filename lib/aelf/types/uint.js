var f = require('./formatters.js');
var BaseType = require('./base');

var TypeUInt = function () {
    this._inputFormatter = f.formatInputUInt;
    this._outputFormatter = f.formatOutputUInt;
};

TypeUInt.prototype = new BaseType({});
TypeUInt.prototype.constructor = TypeUInt;

TypeUInt.prototype.isType = function (name) {
    return !!name.match(/^uint$/);
};

module.exports = TypeUInt;
