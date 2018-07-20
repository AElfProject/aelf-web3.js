var f = require('./formatters.js');
var BaseType = require('./base');

var TypeLong = function () {
    this._inputFormatter = f.formatInputLong;
    this._outputFormatter = f.formatOutputLong;
};

TypeLong.prototype = new BaseType({});
TypeLong.prototype.constructor = TypeLong;

TypeLong.prototype.isType = function (name) {
    return !!name.match(/^long$/);
};

module.exports = TypeLong;
