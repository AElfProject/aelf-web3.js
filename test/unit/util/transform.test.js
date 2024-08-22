import {
  transform,
  transformMapToArray,
  transformArrayToMap,
  encodeAddress,
  INPUT_TRANSFORMERS,
  OUTPUT_TRANSFORMERS
} from '../../../src/util/transform';
import AElf from '../../../src/index';
import tokenProto from './token.proto.json';
import nonStandardProto from './non-standard.proto.json';

describe('test httpProvider', () => {
  test('test transform with fieldsArray', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('TransferInput');
    const params = {
      to: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
      amount: '100000000',
      symbol: 'ELF'
    };
    const result = transform(transferInput, params, INPUT_TRANSFORMERS);
    expect(result.to.value.toString('hex')).toEqual('0e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba');
    expect(result.amount).toEqual('100000000');
    expect(result.symbol).toEqual('ELF');
  });
  test('test transform with empty inputType fieldsArray', async () => {
    const params = {
      amount: '100000000',
      symbol: 'ELF'
    };
    const result = transform({}, params, INPUT_TRANSFORMERS);
    expect(result).toEqual(params);
  });
  test('test transform without field params', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('TransferInput');
    const params = {
      amount: '100000000',
      symbol: 'ELF'
    };
    const result = transform(transferInput, params, INPUT_TRANSFORMERS);
    expect(result.to).toEqual(undefined);
    expect(result.amount).toEqual('100000000');
    expect(result.symbol).toEqual('ELF');
    const params1 = {
      to: '',
      amount: '100000000',
      symbol: 'ELF'
    };
    const result1 = transform(transferInput, params1, INPUT_TRANSFORMERS);
    expect(result1.to).toEqual('');
    expect(result1.amount).toEqual('100000000');
    expect(result1.symbol).toEqual('ELF');
  });
  test('test transform with fieldsArray which has repeated rule ', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('MerklePath');
    const params = {
      merklePathNodes: [
        {
          hash: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
          isLeftChildNode: true
        }
      ]
    };
    const result = transform(transferInput, params, INPUT_TRANSFORMERS);
    expect(result.merklePathNodes[0].hash.value.toString('hex')).toEqual(
      '967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe'
    );
    const result1 = transform(transferInput, {}, INPUT_TRANSFORMERS);
    expect(result1).toEqual({ merklePathNodes: undefined });
  });
  test('test transform with empty fieldsArray', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('TestEmptyFieldsArray');
    const params = {
      merklePathNodes: [
        {
          hash: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
          isLeftChildNode: true
        }
      ]
    };
    const result = transform(transferInput, params);
    expect(result).toEqual(params);
  });
  test('test transformMapToArray without inputType fieldsArray', async () => {
    const params = '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX';
    const result = transformMapToArray({}, params);
    expect(result).toEqual(params);
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
  test('test transformMapToArray with resolvedType', () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('TransferInput');
    const params = {
      address: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
      amount: '100000000',
      symbol: 'ELF'
    };
    const result = transformMapToArray(transferInput, params);
    expect(result).toEqual({
      address: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
      amount: '100000000',
      symbol: 'ELF',
      to: undefined
    });
  });
  test('test transformMapToArray with fieldsArray which has resolvedType', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('MerklePath');
    const params = {
      merklePathNodes: [
        {
          to: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
          isLeftChildNode: true
        }
      ]
    };
    const result = transformMapToArray(transferInput, params);
    expect(result).toEqual({
      merklePathNodes: [
        {
          to: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
          isLeftChildNode: true,
          hash: undefined
        }
      ]
    });
  });
  test('test transformMapToArray with map_entry option', () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('MerklePathNodeMapEntry');
    const params = {
      hash: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
      isLeftChildNode: true
    };
    const result = transformMapToArray(transferInput, params);
    expect(result).toEqual([
      {
        key: 'hash',
        value: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe'
      },
      { key: 'isLeftChildNode', value: true }
    ]);
  });
  test('test transformMapToArray without inputType fieldsArray', async () => {
    const params = '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX';
    const result = transformArrayToMap({}, params);
    expect(result).toEqual(params);
  });
  test('test transformArrayToMap without origin', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    const transferInput = dataType.lookupType('MerklePath');
    const result = transformArrayToMap(transferInput);
    expect(result).toEqual(undefined);
  });
  test('test transformArrayToMap with only one field and has not been resolved', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    const transferInput = dataType.lookupType('Address');
    const params = '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX';
    const result = transformArrayToMap(transferInput, params);
    expect(result).toEqual('7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX');
  });
  test('test transformArrayToMap with resolvedType', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('TransferInput');
    const params = {
      address: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
      amount: '100000000',
      symbol: 'ELF'
    };
    const result = transformArrayToMap(transferInput, params);
    expect(result).toEqual({
      address: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
      amount: '100000000',
      symbol: 'ELF',
      to: undefined
    });
  });
  test('test transformArrayToMap with fieldsArray which has resolvedType', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const transferInput = dataType.lookupType('MerklePath');
    const params = {
      merklePathNodes: [
        {
          to: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
          isLeftChildNode: true
        }
      ]
    };
    const result = transformArrayToMap(transferInput, params);
    expect(result).toEqual({
      merklePathNodes: [
        {
          to: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
          isLeftChildNode: true,
          hash: undefined
        }
      ]
    });
  });
  test('test transformArrayToMap with map_entry option', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    const transferInput = dataType.lookupType('MerklePathNodeMapEntry');
    dataType.resolveAll();
    const params = [
      {
        key: 'hash',
        value: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe'
      },
      { key: 'isLeftChildNode', value: true }
    ];
    const result = transformArrayToMap(transferInput, params);
    expect(result).toEqual({
      hash: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
      isLeftChildNode: true
    });
  });
  test('test transformArrayToMap with map_entry and repeated options', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    const transferInput = dataType.lookupType('MerklePathMapEntry');
    dataType.resolveAll();
    const params = {
      merklePathNodes: [
        {
          key: 'hash',
          value: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe'
        },
        { key: 'isLeftChildNode', value: true }
      ]
    };
    const result = transformArrayToMap(transferInput, params);
    expect(result).toEqual({
      merklePathNodes: {
        hash: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe',
        isLeftChildNode: true
      }
    });
  });
  test('test transformArrayToMap with Enum Array', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    dataType.resolveAll();
    const enumArray = dataType.lookupType('TestEnumArray');
    const params = {
      type: ['EMAIL', 'PHONE']
    };
    const result = transformArrayToMap(enumArray, params);
    expect(result).toEqual({
      type: ['EMAIL', 'PHONE']
    });
  });
  test('test encode address', async () => {
    const address = '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe';
    const result = encodeAddress(address);
    expect(result).toEqual('4rgQm9utVaWDGc8pAexoktzeMDPumVQPZd54geUMDLovuYqZfYXpWdwn8dVa8m5a7DvgA1KLF');
  });
  test('test input address filter with Address format', async () => {
    const dataType = AElf.pbjs.Root.fromJSON(nonStandardProto);
    const transferInput = dataType.lookupType('Address');
    const result = INPUT_TRANSFORMERS[0].filter(transferInput);
    expect(result).toBeFalsy();
  });
  test('test input address transformer with string origin', () => {
    const address = 'ELF_UFRnXNHnVNiWfKZ9c5hSSt9Vt97zYf6xHF7nTNkq7WoiLL4BU_AELF';
    const result = INPUT_TRANSFORMERS[0].transformer(address);
    expect(result.value.toString('hex')).toEqual('3ddf220f80720e28a5d21229adc212acfe89d88b89728a573e25f87e730f51a6');
  });
  test('test input address transformer with array origin', () => {
    const address = ['ELF_UFRnXNHnVNiWfKZ9c5hSSt9Vt97zYf6xHF7nTNkq7WoiLL4BU_AELF'];
    const result = INPUT_TRANSFORMERS[0].transformer(address);
    expect(result[0].value.toString('hex')).toEqual('3ddf220f80720e28a5d21229adc212acfe89d88b89728a573e25f87e730f51a6');
  });
  test('test input hash transformer with string origin', () => {
    const address = '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe';
    const result = INPUT_TRANSFORMERS[1].transformer(address);
    expect(result.value.toString('hex')).toEqual('967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe');
  });
  test('test input hash transformer with array origin', () => {
    const address = ['0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe'];
    const result = INPUT_TRANSFORMERS[1].transformer(address);
    expect(result[0].value.toString('hex')).toEqual('967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe');
  });
  test('test output address transformer with string origin', () => {
    const address = 'ELF_UFRnXNHnVNiWfKZ9c5hSSt9Vt97zYf6xHF7nTNkq7WoiLL4BU_AELF';
    const result = OUTPUT_TRANSFORMERS[0].transformer(address);
    expect(result).toEqual('ELF_UFRnXNHnVNiWfKZ9c5hSSt9Vt97zYf6xHF7nTNkq7WoiLL4BU_AELF');
  });
  test('test output address transformer with object origin', () => {
    const address = {
      value: 'ELF_UFRnXNHnVNiWfKZ9c5hSSt9Vt97zYf6xHF7nTNkq7WoiLL4BU_AELF'
    };
    const result = OUTPUT_TRANSFORMERS[0].transformer(address);
    expect(result).toEqual('93i8Rz5MTnfLURQ7drVMoFoMJGV1axnMQqJL3TpS65aRpMqb4XD8THJvcMFFxeVv');
  });
  test('test output address transformer with array object origin', () => {
    const address = [
      {
        value: 'FXD7R7PHkfRn4fmEDvHCN+7hb2XD0NgAcxXjYkMccuY='
      }
    ];
    const result = OUTPUT_TRANSFORMERS[0].transformer(address);
    expect(result).toEqual(['ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx']);
  });
  test('test output hash transformer with string origin', () => {
    const address = '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe';
    const result = OUTPUT_TRANSFORMERS[1].transformer(address);
    expect(result).toEqual('0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe');
  });
  test('test output hash transformer with array object origin', () => {
    const address = [
      {
        value: 'FXD7R7PHkfRn4fmEDvHCN+7hb2XD0NgAcxXjYkMccuY='
      }
    ];
    const result = OUTPUT_TRANSFORMERS[1].transformer(address);
    expect(result).toEqual(['1570fb47b3c791f467e1f9840ef1c237eee16f65c3d0d8007315e362431c72e6']);
  });
  test('test output address transformer with object origin', () => {
    const address = {
      value: '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe'
    };
    const result = OUTPUT_TRANSFORMERS[1].transformer(address);
    expect(result).toEqual(
      'd31f7aedfd9ad9cedfddddb67fddbbf35ef97357ba69adfd71ff75ef575bf7575c79a71de5e7b47f7edcd9ee74edbe5a6d'
    );
  });
});
