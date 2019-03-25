var sha256 = require('js-sha256').sha256;

/**
 * @return {null}
 */
module.exports.ComputeRoot = function (data) {
    if (data.length === 0)
    {
        return null;
    }
    console.log(data.length);

    if(data.length % 2 === 1)
        data.push(data[data.length - 1]);
    console.log(data.length);
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

    Root = data[data.length - 1];
    return Root;
};

var fromTwoBuffers = function(data){
    if(data.length !== 2)
        throw new TypeError('Wrong data size.');

    var compared = Buffer.compare(data[0], data[1]);
    if(compared > 0)
    {
        console.log('reverse');
        data.reverse();
    }

    var buffer = Buffer.concat(data);
    buffer = Buffer.from(sha256(buffer), 'hex');
    return buffer;
};