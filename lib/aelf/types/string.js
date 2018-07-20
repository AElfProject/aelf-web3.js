var f = require('./formatters.js');
var BaseType = require('./base');

var TypeString = function () {
    this._inputFormatter = f.formatInputString;
    this._outputFormatter = f.formatOutputString;
};

TypeString.prototype = new BaseType({});
TypeString.prototype.constructor = TypeString;

TypeString.prototype.isType = function (name) {
    return !!name.match(/^string$/);
};

module.exports = TypeString;
