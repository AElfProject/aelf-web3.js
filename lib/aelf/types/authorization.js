var f = require('./formatters.js');
var BaseType = require('./base');

var TypeAuthorization = function () {
    this._inputFormatter = f.formatInputAuthorization;
    this._outputFormatter = f.formatOutputAuthorization;
};

TypeAuthorization.prototype = new BaseType({});
TypeAuthorization.prototype.constructor = TypeAuthorization;
TypeAuthorization.prototype.isType = function (name) {
    return !!name.match(/^AElf\.Kernel\.Authorization$/);
};
module.exports = TypeAuthorization;
