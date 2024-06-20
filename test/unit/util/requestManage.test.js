import RequestManager from '../../../src/util/requestManage';
import HttpProvider from '../../../src/util/httpProvider';
const stageEndpoint = 'https://explorer-test-tdvw.aelf.io/';
describe('test requestManage', () => {
  test('test prepare request with lower case', () => {
    const result = RequestManager.prepareRequest({
      requestMethod: 'get',
      method: 'blockHeight',
      params: {
        addition: 'test',
      },
    });
    expect(result.method).toEqual('GET');
    expect(result.url).toEqual('blockHeight');
    expect(result.params).toEqual({ addition: 'test' });
  });
  test('test prepare request with empty params', () => {
    const result = RequestManager.prepareRequest({
      requestMethod: 'get',
      method: 'blockHeight',
    });
    expect(result.method).toEqual('GET');
    expect(result.url).toEqual('blockHeight');
    expect(result.params).toEqual({});
  });
  test('test set provider', () => {
    const httpProvider = new HttpProvider(stageEndpoint);
    const requestManage = new RequestManager();
    requestManage.setProvider(httpProvider);
    expect(requestManage.provider).toBe(httpProvider);
  });
  test('test send with provider', () => {
    const httpProvider = new HttpProvider('https://aelf-public-node.aelf.io');
    const requestManage = new RequestManager(httpProvider);
    try {
      const result = requestManage.send({
        requestMethod: 'post',
        method: 'blockChain/calculateTransactionFee',
        params: {
          RawTransaction:
            '0a220a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb275468212220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba18a8a19e022204fa60011c2a085472616e73666572322e0a220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba1203454c461880c2d72f82f10441ad1647aa462a8859c7a699f22d6124c82a5239c90746ac67ebfd8e1a7b4a25f343733351162d205fc881ea62072e9fe0fad5f6113734309b6666f6812d6b7a6400',
        },
      });
      expect(result).toMatchObject({
        Success: false,
        TransactionFee: null,
        ResourceFee: null,
      });
    } catch(error) {
      expect(error).toMatchObject({
        Success: false,
        TransactionFee: null,
        ResourceFee: null,
      });
    }
  });
  test('test send without provider', () => {
    const requestManage = new RequestManager();
    const result = requestManage.send({
      requestMethod: 'post',
      method: 'blockChain/calculateTransactionFee',
      params: {
        RawTransaction:
          '0a220a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb275468212220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba18a8a19e022204fa60011c2a085472616e73666572322e0a220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba1203454c461880c2d72f82f10441ad1647aa462a8859c7a699f22d6124c82a5239c90746ac67ebfd8e1a7b4a25f343733351162d205fc881ea62072e9fe0fad5f6113734309b6666f6812d6b7a6400',
      },
    });
    expect(result).toEqual(null);
  });
  test('test send async with provider', async () => {
    const httpProvider = new HttpProvider('https://aelf-public-node.aelf.io');
    const requestManage = new RequestManager(httpProvider);
    try {
      const result = await requestManage.sendAsync({
        requestMethod: 'post',
        method: 'blockChain/calculateTransactionFee',
        params: {
          RawTransaction:
            '0a220a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb275468212220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba18a8a19e022204fa60011c2a085472616e73666572322e0a220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba1203454c461880c2d72f82f10441ad1647aa462a8859c7a699f22d6124c82a5239c90746ac67ebfd8e1a7b4a25f343733351162d205fc881ea62072e9fe0fad5f6113734309b6666f6812d6b7a6400',
        },
      });
    } catch (error) {
      expect(error).toMatchObject({
        Success: false,
        TransactionFee: null,
        ResourceFee: null,
      });
    }
  });
  test('test send async without provider', async () => {
    const requestManage = new RequestManager();
    const result = await requestManage.sendAsync({
      requestMethod: 'post',
      method: 'blockChain/calculateTransactionFee',
      params: {
        RawTransaction:
          '0a220a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb275468212220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba18a8a19e022204fa60011c2a085472616e73666572322e0a220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba1203454c461880c2d72f82f10441ad1647aa462a8859c7a699f22d6124c82a5239c90746ac67ebfd8e1a7b4a25f343733351162d205fc881ea62072e9fe0fad5f6113734309b6666f6812d6b7a6400',
      },
    });
    expect(result).toEqual(null);
  });
});
