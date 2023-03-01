import {
  transform,
  transformMapToArray,
  transformArrayToMap,
  encodeAddress,
  INPUT_TRANSFORMERS,
} from '../../../src/util/transform';
import AElf from '../../../src/index';
import tokenProto from './token.proto.json';
const endpoint = 'https://aelf-public-node.aelf.io';

describe('test httpProvider', () => {
  test('test transform with fieldsArray', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('TransferInput');
    const params = {
      to: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
      amount: '100000000',
      symbol: 'ELF',
    };
    const result = transform(transferInput, params, INPUT_TRANSFORMERS);
    expect(result.to.value.toString('hex')).toEqual(
      '0e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba'
    );
    expect(result.amount).toEqual('100000000');
    expect(result.symbol).toEqual('ELF');
  });
  test('test transform with fieldsArray which has repeated rule ', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('MerklePath');
    const params = {
      merklePathNodes: [
        {
          hash: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
          isLeftChildNode: true,
        },
      ],
    };
    const result = transform(transferInput, params, INPUT_TRANSFORMERS);
    expect(result.merklePathNodes[0].hash.value.toString('hex')).toEqual(
      '967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe'
    );
  });
  test('test transformMapToArray without origin', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    const transferInput = dataType.lookupType('MerklePath');
    const result = transformMapToArray(transferInput);
    expect(result).toEqual(undefined);
  });
  test('test transformMapToArray with only one field and has not been resolved', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    const transferInput = dataType.lookupType('Address');
    const params = '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX';
    const result = transformMapToArray(transferInput, params);
    expect(result).toEqual('7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX');
  });
  test('test transformMapToArray with fieldsArray which has resolvedType', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('MerklePath');
    const params = {
      merklePathNodes: [
        {
          to: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
          isLeftChildNode: true,
        },
      ],
    };
    const result = transformMapToArray(transferInput, params);
  });
  test('test transformMapToArray with map_entry option', () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('MerklePathNodeMapEntry');
    const params = {
      hash: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
      isLeftChildNode: true,
    };
    const result = transformMapToArray(transferInput, params);
  });
  test('test transformArrayToMap with resolvedType', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('TransferInput');
    const params = {
      to: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
      amount: '100000000',
      symbol: 'ELF',
    };
    const result = transformArrayToMap(transferInput, params);
  });
  test('test transformArrayToMap with fieldsArray which has resolvedType', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('MerklePath');
    const params = {
      merklePathNodes: [
        {
          to: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
          isLeftChildNode: true,
        },
      ],
    };
    const result = transformArrayToMap(transferInput, params);
  });
  test('test transformArrayToMap with map_entry option', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    const transferInput = dataType.lookupType('MerklePathNodeMapEntry');
    dataType.resolveAll();
    const params = [
      {
        key: 'hash',
        value:
          '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
      },
      { key: 'isLeftChildNode', value: true },
    ];
    const result = transformArrayToMap(transferInput, params);
  });
  test('test encode address', async () => {
    const address =
      '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe';
    const result = encodeAddress(address);
    expect(result).toEqual(
      '4rgQm9utVaWDGc8pAexoktzeMDPumVQPZd54geUMDLovuYqZfYXpWdwn8dVa8m5a7DvgA1KLF'
    );
  });
});
