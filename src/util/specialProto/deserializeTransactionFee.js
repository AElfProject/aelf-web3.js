/**
 * @author hzz780
 * @description deserialize the data of transaction fee
 */
import * as protobuf from '@aelfqueen/protobufjs/light';
import transactionFeeDescriptor from '../../../proto/transaction_fee.proto.json';

export const transactionFeeProto = protobuf.Root.fromJSON(transactionFeeDescriptor);

export const deserializeTransactionFee = (base64Str, keyName) => {
  const input = transactionFeeProto.nested.aelf[keyName];
  const decodedString = input.decode(Buffer.from(base64Str, 'base64'));
  return input.toObject(decodedString, {
    enums: String, // enums as string names
    longs: String, // longs as strings (requires long.js)
    bytes: String, // bytes as base64 encoded strings
    defaults: true, // includes default values
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
    objects: true, // populates empty objects (map fields) even if defaults=false
    oneofs: true // includes virtual oneof fields set to the present field's name
  });
};
