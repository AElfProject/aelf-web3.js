import { computeRoot, getMerklePath, node } from '../../../src/util/merkleTree';
import { keccak256 } from '../../../src/util/hash';
import { arrayBufferToHex } from '../../../src/util/proto';
describe('test merkleTree', () => {
  test('test compute root', () => {
    const whitelistAddresses = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const leafNodes = whitelistAddresses.map((addr) => {
      addr = keccak256(addr);
      return Buffer.from(addr.replace('0x', ''), 'hex');
    });
    const result = computeRoot(leafNodes);

    console.log(arrayBufferToHex(result));
  });
});
