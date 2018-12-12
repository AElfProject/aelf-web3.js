var f = require('./formatters.js');
var BaseType = require('./base');

var TypeAuthorization = function () {
    this._inputFormatter = f.formatInputAuthorization;
    this._outputFormatter = f.formatInputAuthorization;
};

TypeAuthorization.prototype = new BaseType({});
TypeAuthorization.prototype.constructor = TypeAuthorization;

module.exports = TypeAuthorization;
