var f = require('./formatters.js');
var BaseType = require('./base');

var TypeULong = function () {
    this._inputFormatter = f.formatInputULong;
    this._outputFormatter = f.formatOutputULong;
};

TypeULong.prototype = new BaseType({});
TypeULong.prototype.constructor = TypeULong;

TypeULong.prototype.isType = function (name) {
    return !!name.match(/^ulong$/);
};

module.exports = TypeULong;
