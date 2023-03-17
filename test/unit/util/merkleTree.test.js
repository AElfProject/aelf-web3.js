import {
  computeRoot,
  getMerklePath,
  node,
  __RewireAPI__ as MerkleTreeModuleRewireAPI,
} from '../../../src/util/merkleTree';
import { keccak256 } from '../../../src/util/hash';
import { arrayBufferToHex } from '../../../src/util/proto';
describe('test merkleTree', () => {
  test('test compute root', () => {
    const whitelistAddresses = ['A', 'B', 'C', 'D'];
    const leafNodes = whitelistAddresses.map((addr) => {
      addr = keccak256(addr);
      return Buffer.from(addr.replace('0x', ''), 'hex');
    });
    const result = computeRoot(leafNodes);
    expect(arrayBufferToHex(result)).toEqual(
      'd13ef7efe1589de6f776eb88e0e596ad2ec71a869c5b04258ce66c361df908b0'
    );
  });
  test('generate merkle tree with no data',() => {
    const generateMerkleTree =
      MerkleTreeModuleRewireAPI.__get__('generateMerkleTree');
    expect(generateMerkleTree([])).toEqual(null);
  });
  test('test get merkle path', () => {
    const whitelistAddresses = ['A', 'B', 'C', 'D'];
    const leafNodes = whitelistAddresses.map((addr) => {
      addr = keccak256(addr);
      return Buffer.from(addr.replace('0x', ''), 'hex');
    });

    const result = getMerklePath(2, leafNodes);
    expect(result.length).toEqual(2);
    expect(result[0]).toBeInstanceOf(Buffer);
    expect(result[0].toString('hex')).toEqual(
      '6c3fd336b49dcb1c57dd4fbeaf5f898320b0da06a5ef64e798c6497600bb79f2'
    );
    expect(result[1]).toBeInstanceOf(Buffer);
    expect(result[1].toString('hex')).toEqual(
      '945f096eeb56a1a6bee38b6a663407d9c890cd8be28c286c29bcc7d29198f90e'
    );
  });
  test('test get merkle path with reverse sequence', () => {
    const whitelistAddresses = ['D', 'C', 'B', 'A'];
    const leafNodes = whitelistAddresses.map((addr) => {
      addr = keccak256(addr);
      return Buffer.from(addr.replace('0x', ''), 'hex');
    });

    const result = getMerklePath(2, leafNodes);
    expect(result.length).toEqual(2);
    expect(result[0]).toBeInstanceOf(Buffer);
    expect(result[0].toString('hex')).toEqual(
      '03783fac2efed8fbc9ad443e592ee30e61d65f471140c10ca155e937b435b760'
    );
    expect(result[1]).toBeInstanceOf(Buffer);
    expect(result[1].toString('hex')).toEqual(
      'bf5568097309810e5d362532a3c5c4fc633144597ad943a38f938d2ca70796ef'
    );
  });
  test('test get merkle path with long sequence', () => {
    const whitelistAddresses = ['A', 'B', 'C', 'D', 'E', 'F'];
    const leafNodes = whitelistAddresses.map((addr) => {
      addr = keccak256(addr);
      return Buffer.from(addr.replace('0x', ''), 'hex');
    });

    const result = getMerklePath(2, leafNodes);
    expect(result.length).toEqual(3);
    expect(result[0]).toBeInstanceOf(Buffer);
    expect(result[0].toString('hex')).toEqual(
      '6c3fd336b49dcb1c57dd4fbeaf5f898320b0da06a5ef64e798c6497600bb79f2'
    );
    expect(result[1]).toBeInstanceOf(Buffer);
    expect(result[1].toString('hex')).toEqual(
      '945f096eeb56a1a6bee38b6a663407d9c890cd8be28c286c29bcc7d29198f90e'
    );
  });
  test('test get merkle path', () => {
    const whitelistAddresses = ['A', 'B', 'C'];
    const leafNodes = whitelistAddresses.map((addr) => {
      addr = keccak256(addr);
      return Buffer.from(addr.replace('0x', ''), 'hex');
    });

    const result = getMerklePath(4, leafNodes);
    expect(result).toEqual(null);
  });
  test('test node', () => {
    const buffer = Buffer.from('A');
    const resultStr = node('A');
    const resultBuffer = node(buffer);
    expect(resultStr.toString('hex')).toEqual(
      '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd'
    );
    expect(resultBuffer.toString('hex')).toEqual(
      '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd'
    );
  });
  test('should throw error if get more than two params',() => {
    const fromTwoBuffers = MerkleTreeModuleRewireAPI.__get__('fromTwoBuffers');
    const params = [Buffer.from('1'),Buffer.from('2'),Buffer.from('3')];
    expect(() => fromTwoBuffers(params)).toThrow('Wrong data size.');
  });
});
