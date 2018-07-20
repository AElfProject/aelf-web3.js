var f = require('./formatters.js');
var BaseType = require('./base');

var TypeInt = function () {
    this._inputFormatter = f.formatInputInt;
    this._outputFormatter = f.formatOutputInt;
};

TypeInt.prototype = new BaseType({});
TypeInt.prototype.constructor = TypeInt;

TypeInt.prototype.isType = function (name) {
    return !!name.match(/^int$/);
};

module.exports = TypeInt;
