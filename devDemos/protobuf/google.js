/**
 * @file google.js
 * @author huangzongzhe
 */

var jspb = require('google-protobuf');

var writter = new jspb.BinaryWriter();
writter.writeUint64(1, 100000);
writter.writeUint64(2, 100000);
writter.writeUint64(3, 100000);
writter.writeUint64(4, 100000);
writter.writeUint64String(1, '98a5e204');

var temp = new Uint8Array(['0xa0', '0x8d', '0x06']);
var temp10 = new Uint8Array(['10', '0xa0', '0x8d', '0x06']); // error
var temp10 = new Uint8Array(['8', '0x98', '0xa5', '0xe2', '0x04']); // 98a5e204

// protobuf
var proto = require('protobufjs');
function stringToBuffer(input) {
    let resultArray = [];
    if (typeof input !== 'string' || input.length % 2 !== 0) {
        throw Error('invalid input');
    }
    for (let i = 0, length = input.length; i < length; i += 2) {
        resultArray.push('0x' + input.slice(i, i + 2));
    }
    return Buffer.from(resultArray);
}
// var reader = new proto.Reader(Buffer.from(['0x98', '0xa5', '0xe2', '0x04']));
var reader = new proto.Reader(stringToBuffer('98a5e204'));
reader.uint64();
// 注意buffer数据
// {
//     blocks_: [],
//     totalLength_: 0,
//     encoder_: {
//         buffer_: [8, 160, 141, 6, 16, 160, 141, 6, 24, 160, 141, 6, 32, 160, 141, 6]
//     },
//     bookmarks_: []
// }

var reader = jspb.BinaryReader.alloc(writter.getResultBuffer());
var reader = jspb.BinaryReader.alloc(temp10);
reader.nextField();
reader.readUint64();
