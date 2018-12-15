var f = require('./formatters.js');
var BaseType = require('./base');

var TypeProposal = function () {
    this._inputFormatter = f.formatInputProposal;
    this._outputFormatter = f.formatOutputProposal;
};

TypeProposal.prototype = new BaseType({});
TypeProposal.prototype.constructor = TypeProposal;
TypeProposal.prototype.isType = function (name) {
    return !!name.match(/^AElf\.Kernel\.Proposal$/);
};
module.exports = TypeProposal;