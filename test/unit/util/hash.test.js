import { keccak256, keccak512 } from '../../../src/util/hash';
const gbk = require('gbk-string');

describe('test hash', () => {
  test('test keccak256', () => {
    expect(keccak256('123')).toBe(
      '0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107'
    );
    expect(keccak256('0x10')).toBe(
      '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe'
    );
  });
  test('test keccak512', () => {
    expect(keccak512('123')).toBe(
      '0x8ca32d950873fd2b5b34a7d79c4a294b2fd805abe3261beb04fab61a3b4b75609afd6478aa8d34e03f262d68bb09a2ba9d655e228c96723b2854838a6e613b9d'
    );
    expect(keccak512('0x10')).toBe(
      '0xb001948a61ea302020834365737a1d7464ab8bcc27115b7d71ab7d245ded3575cc1b77cd3f0d87fb11e72ad6c008bd14ded7cc8d05f83b8d58004885ab39ba75'
    );
  });
});
