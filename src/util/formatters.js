/**
 * @file formatters.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */
import descriptor from '@aelfqueen/protobufjs/ext/descriptor';

// export const inputAddressFormatter = address => {
//   // if (address.startsWith('ELF_')) {
//   //     var parts = address.split('_');
//   //     var b58rep = parts[parts.length - 1];
//   //     return base58check.decode(b58rep, 'hex');
//   // }
//   // throw new Error('invalid address');
//   return address;
// };

export const inputAddressFormatter = address => address;

/**
 * @param {String} result base64 representation of serialized FileDescriptorSet
 * @returns {FileDescriptorSet} decoded FileDescriptorSet message
 */
export const outputFileDescriptorSetFormatter = result => {
  const buffer = Buffer.from(result, 'base64');
  return descriptor.FileDescriptorSet.decode(buffer);
};
