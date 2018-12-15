var f = require('./formatters.js');
var BaseType = require('./base');

var TypeSideChainInfo = function () {
    this._inputFormatter = f.formatInputSideChainInfo;
    this._outputFormatter = f.formatOutputSideChainInfo;
};

TypeSideChainInfo.prototype = new BaseType({});
TypeSideChainInfo.prototype.constructor = TypeSideChainInfo;
TypeSideChainInfo.prototype.isType = function (name) {
    return !!name.match(/^AElf\.Kernel\.SideChainInfo$/);
};
module.exports = TypeSideChainInfo;