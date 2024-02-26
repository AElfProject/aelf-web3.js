import {
  getFee,
  getSerializedDataFromLog,
  getResourceFee,
  getTransactionFee,
  arrayBufferToHex,
  getRepForAddress,
  getAddressFromRep,
  getAddressObjectFromRep,
  getRepForHash,
  getHashFromHex,
  getHashObjectFromHex,
  encodeTransaction,
  getTransaction,
} from '../../../src/util/proto';

describe('test proto', () => {
  test('deserialize fee', () => {
    const Logs = [
      {
        Address: '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB',
        Name: 'TransactionFeeCharged',
        Indexed: null,
        NonIndexed: 'CgNFTEYQoI/hGQ==',
      },
    ];
    expect(getTransactionFee(Logs)).toEqual([
      {
        symbol: 'ELF',
        amount: '54020000',
      },
    ]);
    expect(getTransactionFee(Logs).length).toEqual(1);
    expect(getFee('CgNFTEYQoI/hGQ==', 'TransactionFeeCharged')).toEqual(
      getTransactionFee(Logs)[0]
    );
    expect(getResourceFee(Logs).length).toEqual(0);
    expect(() => getFee('CgNFTEYQoI/hGQ==', 'ResourceToken')).toThrow();
  });
  test('test fee with TransactionFeeCharged type', () => {
    const result = getFee('CgNFTEYQoI/hGQ==', 'TransactionFeeCharged');
    expect(result).toEqual({
      symbol: 'ELF',
      amount: '54020000',
    });
    expect(getFee('CgNFTEYQoI/hGQ==')).toEqual({
      symbol: 'ELF',
      amount: '54020000',
    });
  });
  test('test fee with ResourceTokenCharged type', () => {
    const result = getFee('CgNFTEYQoI/hGQ==', 'ResourceTokenCharged');
    expect(result).toEqual({
      symbol: 'ELF',
      amount: '54020000',
      contractAddress: null,
    });
  });
  test('test fee with wrong type', () => {
    expect(() => getFee('CgNFTEYQoI/hGQ==', 'MerklePath')).toThrow();
  });
  test('test get serialized data from log', () => {
    const log = {
      Indexed: [
        'CiIKILEmXenHStaFyei2ijKTSRTSXFwtYJZtuzCVOHs3KWEp',
        'EiIKIIw9aDQ+0IsgauW4z2rbA/hDk944n5QN6KI2S6s3Bb3h',
        'GgNFTEY=',
      ],
      NonIndexed: 'IIDIr6Al',
      Name: 'Transferred',
      Address: 'ELF_JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE_AELF',
    };
    const result = getSerializedDataFromLog(log);
    expect(result).toEqual(
      'CiIKILEmXenHStaFyei2ijKTSRTSXFwtYJZtuzCVOHs3KWEpEiIKIIw9aDQ+0IsgauW4z2rbA/hDk944n5QN6KI2S6s3Bb3hGgNFTEY=IIDIr6Al'
    );
    expect(
      getSerializedDataFromLog({
        Indexed: [
          'CiIKILEmXenHStaFyei2ijKTSRTSXFwtYJZtuzCVOHs3KWEp',
          'EiIKIIw9aDQ+0IsgauW4z2rbA/hDk944n5QN6KI2S6s3Bb3h',
          'GgNFTEY=',
        ],
        Name: 'Transferred',
        Address: 'ELF_JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE_AELF',
      })
    ).toEqual(
      'CiIKILEmXenHStaFyei2ijKTSRTSXFwtYJZtuzCVOHs3KWEpEiIKIIw9aDQ+0IsgauW4z2rbA/hDk944n5QN6KI2S6s3Bb3hGgNFTEY='
    );
  });
  test('test get serialized data from log when Indexed is null', () => {
    const log = {
      Indexed: null,
      NonIndexed: 'IIDIr6Al',
      Name: 'Transferred',
      Address: 'ELF_JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE_AELF',
    };
    const result = getSerializedDataFromLog(log);
    expect(result).toEqual('IIDIr6Al');
    expect(
      getSerializedDataFromLog({
        NonIndexed: 'IIDIr6Al',
        Name: 'Transferred',
        Address: 'ELF_JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE_AELF',
      })
    ).toEqual('IIDIr6Al');
  });
  test('test get resource fee', () => {
    const logs = [
      {
        Address: '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB',
        Name: 'ResourceTokenCharged',
        Indexed: null,
        NonIndexed: 'CgNFTEYQoI/hGQ==',
      },
    ];
    const result = getResourceFee(logs);
    expect(result).toEqual([
      { symbol: 'ELF', amount: '54020000', contractAddress: null },
    ]);
  });
  test('test get resource fee without ResourceTokenCharged type', () => {
    const logs = [
      {
        Address: '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB',
        Name: 'TransactionFeeCharged',
        NonIndexed: 'CgNFTEYQoI/hGQ==',
      },
    ];
    const result = getResourceFee(logs);
    expect(result.length).toEqual(0);
  });
  test('test get resource fee with empty input', () => {
    const result = getResourceFee();
    expect(result.length).toEqual(0);
  });
  test('test get transaction fee', () => {
    const logs = [
      {
        Address: '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB',
        Name: 'TransactionFeeCharged',
        NonIndexed: 'CgNFTEYQoI/hGQ==',
      },
    ];
    const result = getTransactionFee(logs);
    expect(result).toEqual([{ symbol: 'ELF', amount: '54020000' }]);
  });
  test('test get transaction fee without TransactionFeeCharged type', () => {
    const logs = [
      {
        Address: '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB',
        Name: 'ResourceTokenCharged',
        Indexed: null,
        NonIndexed: 'CgNFTEYQoI/hGQ==',
      },
    ];
    const result = getTransactionFee(logs);
    expect(result.length).toEqual(0);
  });
  test('test get transaction fee with empty input', () => {
    const result = getTransactionFee();
    expect(result.length).toEqual(0);
  });
  test('test arrayBuffer to Hex', () => {
    const buffer = new ArrayBuffer(4);
    let view = new Uint8Array(buffer);
    for (let i = 0; i < view.length; i++) {
      view[i] = 10 + i;
    }
    const result = arrayBufferToHex(buffer);
    expect(result).toEqual('0a0b0c0d');
  });
  test('test get rep from address', () => {
    const result = getRepForAddress({
      value: '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB',
    });
    expect(result).toEqual(
      'q9sA88YfqXJEQrKx8vmECZzMJytpw7GySFRnyYSJoBGqfsgFZpdf1SwQ'
    );
  });
  test('test get rep from address with invalid params', () => {
    const result = getRepForAddress({});
    expect(result).toEqual('3QJmnh');
  });

  test('test get address from rep', () => {
    const buffer = getAddressFromRep(
      'q9sA88YfqXJEQrKx8vmECZzMJytpw7GySFRnyYSJoBGqfsgFZpdf1SwQ'
    ).value;
    expect(buffer).toBeInstanceOf(Buffer);
    const str = buffer.toString('hex');
    expect(str).toEqual(
      'db909e72b53de1d98c75b842dcb58c2b1b6868be16bfc3c2846bd524ce8fc641c0caf5c484'
    );
  });
  test('test get address object from rep', () => {
    const buffer = getAddressObjectFromRep(
      'q9sA88YfqXJEQrKx8vmECZzMJytpw7GySFRnyYSJoBGqfsgFZpdf1SwQ'
    ).value;
    expect(buffer).toBeInstanceOf(Buffer);
    const str = buffer.toString('hex');
    expect(str).toEqual(
      'db909e72b53de1d98c75b842dcb58c2b1b6868be16bfc3c2846bd524ce8fc641c0caf5c484'
    );
  });
  test('test get rep from hash', () => {
    const result = getRepForHash({
      value: '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB',
    });
    expect(result).toEqual(
      'db909e72b53de1d98c75b842dcb58c2b1b6868be16bfc3c2846bd524ce8fc641c0caf5c484'
    );
  });
  test('test get rep from hash with invalid params', () => {
    const result = getRepForHash({});
    expect(result).toEqual('');
  });
  test('test get hash from hex', () => {
    const result = getHashFromHex(
      'db909e72b53de1d98c75b842dcb58c2b1b6868be16bfc3c2846bd524ce8fc641c0caf5c484'
    );
    const hex = result.value.toString('hex');
    expect(hex).toEqual(
      'db909e72b53de1d98c75b842dcb58c2b1b6868be16bfc3c2846bd524ce8fc641c0caf5c484'
    );
  });
  test('test get hash object from hex', () => {
    const result = getHashObjectFromHex(
      'db909e72b53de1d98c75b842dcb58c2b1b6868be16bfc3c2846bd524ce8fc641c0caf5c484'
    );
    const hex = result.value.toString('hex');
    expect(hex).toEqual(
      'db909e72b53de1d98c75b842dcb58c2b1b6868be16bfc3c2846bd524ce8fc641c0caf5c484'
    );
  });
  test('test encode transaction to protobuf type', () => {
    const result = encodeTransaction({
      from: '2tq1cktLYCkc6MpQXPvj1pb1vBQhc8c6ZxaX5nq5dEjbXvWS75',
      methodName: 'DonateResourceToken',
      params:
        '{ "blockHash": "21cbeb3ac049d5a91c66c87f7ae48923fa469c11794f7eecdc721d4e26be48f9", "blockHeight": "136624547" }',
      refBlockNumber: 136624547,
      refBlockPrefix: 'IcvrOg==',
      signature:
        '+9HkFh+ApJqnJp9gmLVwdQQFH283lQaLNpU5udWa818r6ig2ACll/CjFMSvvCsUkvC2xAoIJjruB+WgabiGs9gA=',
      to: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
    });
    expect(result).toBeInstanceOf(Buffer);
    const hex = result.toString('hex');
    expect(hex).toEqual(
      '0a00120018a3f39241220421cbeb3a2a13446f6e6174655265736f75726365546f6b656e32456e5a1c9076ac876d5c6de6f769cd38f5de5af7573ae9cf3b7fb69ee3cf76ddf6b8ebd735d7bf787fb79e71d73bdb57787b6e9b7b8f1ff5b9687241de8a086dd77ebadb8e7882f10441fbd1e4161f80a49aa7269f6098b5707504051f6f3795068b369539b9d59af35f2bea2836002965fc28c5312bef0ac524bc2db10282098ebb81f9681a6e21acf600'
    );
  });
  test('test get transaction', () => {
    const result = getTransaction(
      '2tq1cktLYCkc6MpQXPvj1pb1vBQhc8c6ZxaX5nq5dEjbXvWS75',
      'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
      'DonateResourceToken',
      '{ "blockHash": "21cbeb3ac049d5a91c66c87f7ae48923fa469c11794f7eecdc721d4e26be48f9", "blockHeight": "136624547" }'
    );
    expect(result.from.value).toBeInstanceOf(Buffer);
    expect(result.from.value.toString('hex')).toEqual(
      'f9609c60db810203811cd99a9714b45be196c313348063a82d35faafd037480c'
    );
    expect(result.to.value).toBeInstanceOf(Buffer);
    expect(result.to.value.toString('hex')).toEqual(
      '2791e992a57f28e75a11f13af2c0aec8b0eb35d2f048d42eba8901c92e0378dc'
    );
  });
});
