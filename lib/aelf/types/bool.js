var f = require('./formatters.js');
var BaseType = require('./base');

var TypeBool = function () {
    this._inputFormatter = f.formatInputBool;
    this._outputFormatter = f.formatOutputBool;
};

TypeBool.prototype = new BaseType({});
TypeBool.prototype.constructor = TypeBool;

TypeBool.prototype.isType = function (name) {
    return !!name.match(/^bool$/);
};

module.exports = TypeBool;
