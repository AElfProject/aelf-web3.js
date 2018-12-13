var f = require('./formatters.js');
var BaseType = require('./base');

var TypeApproval = function () {
    this._inputFormatter = f.formatInputApproval;
    this._outputFormatter = f.formatOutputApproval;
};

TypeApproval.prototype = new BaseType({});
TypeApproval.prototype.constructor = TypeApproval;
TypeApproval.prototype.isType = function (name) {
    return !!name.match(/^AElf\.Kernel\.Approval$/);
};
module.exports = TypeApproval;