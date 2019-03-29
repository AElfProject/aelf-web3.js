var sha256 = require('js-sha256').sha256;

/**
 * @return {null}
 */

module.exports.computeRoot = function (data) {
    var merkleTree = generateMerkleTree(data);
    return merkleTree[merkleTree.length -1];
};

module.exports.getMerklePath = function(index, data){
    var leafCount = data.length;
    var merkleTree = generateMerkleTree(data);
    return generateMerklePath(index, leafCount, merkleTree);
};

module.exports.node = function(buffer){
    return Buffer.from(sha256(buffer), 'hex')
};

var generateMerkleTree = function (data) {
    if (data.length === 0)
    {
        return null;
    }

    if(data.length % 2 === 1)
        data.push(data[data.length - 1]);
    var nodeToAdd = data.length / 2;
    var newAdded = 0;
    var i = 0;
    while (i < data.length - 1)
    {
        var left = data[i++];
        var right = data[i++];
        data.push(fromTwoBuffers([left, right]));
        if (++newAdded !== nodeToAdd)
            continue;

        // complete this row
        if (nodeToAdd % 2 === 1 && nodeToAdd !== 1)
        {
            nodeToAdd++;
            data.push(data[data.length - 1]);
        }
        // start a new row
        nodeToAdd /= 2;
        newAdded = 0;
    }
    return data;
};

var generateMerklePath = function(index, leafCount, tree){
    if (tree.length === 0 || index >= leafCount)
        return null;

    var firstInRow = 0;
    var rowcount = leafCount;
    var path=[];
    while (index < tree.length - 1)
    {
        var neighbor = index % 2 === 0 ? index + 1 : index - 1;
        path.push(tree[neighbor]);
        rowcount = rowcount % 2 === 0 ? rowcount : rowcount + 1;
        var shift = Math.floor((index - firstInRow) / 2);
        firstInRow += rowcount;
        index = firstInRow + shift;
        rowcount /= 2;
    }
    return path;
};

var fromTwoBuffers = function(data){
    if(data.length !== 2)
        throw new TypeError('Wrong data size.');

    var compared = Buffer.compare(data[0], data[1]);
    if(compared > 0)
    {
        data.reverse();
    }

    var buffer = Buffer.concat(data);
    buffer = Buffer.from(sha256(buffer), 'hex');
    return buffer;
};