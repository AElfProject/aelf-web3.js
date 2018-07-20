var f = require('./formatters.js');
var BaseType = require('./base');

var TypeBytes = function () {
    this._inputFormatter = f.formatInputBytes;
    this._outputFormatter = f.formatOutputBytes;
};

TypeBytes.prototype = new BaseType({});
TypeBytes.prototype.constructor = TypeBytes;

TypeBytes.prototype.isType = function (name) {
    return !!name.match(/^byte\[\]$/);
};

module.exports = TypeBytes;
