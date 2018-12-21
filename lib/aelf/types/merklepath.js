var f = require('./formatters.js');
var BaseType = require('./base');

var TypeMerklePath = function () {
    this._inputFormatter = f.formatInputMerklePath;
};

TypeMerklePath.prototype = new BaseType({});
TypeMerklePath.prototype.constructor = TypeMerklePath;
TypeMerklePath.prototype.isType = function (name) {
    return !!name.match(/^AElf\.Kernel\.MerklePath$/);
};
module.exports = TypeMerklePath;