import RequestManager from '../../../src/util/requestManage';
import HttpProvider from '../../../src/util/httpProvider';
import { tdvwEndPoint } from '../constant';
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
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const requestManage = new RequestManager();
    requestManage.setProvider(httpProvider);
    expect(requestManage.provider).toBe(httpProvider);
  });
  test('test send with provider', () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const requestManage = new RequestManager(httpProvider);
    const result = requestManage.send({
      requestMethod: 'post',
      method: 'blockChain/executeTransaction',
      params: {
        RawTransaction:
          '0a220a203000800ce18e6de0fc576a48759d9dc90a23f0ded388316b0f9f1274a45b809b12220a202ec3700300ef9c95ee67a20a35dad35b8b0d476533e009a746b015df7d051e2d2a1c43616c63756c6174654f7267616e697a6174696f6e4164647265737332560a240a220a2024447d28d0da2f7923a917a4176214032541bda3d0d1a4c8195f3ecccc034fc7120808011000180020011a240a220a2024447d28d0da2f7923a917a4176214032541bda3d0d1a4c8195f3ecccc034fc782f104417582ebfba9506ec499b4ac36653f0c8feefa66d32eb0cd88ed4a608187c85fea75e37405c37de7d9bf3ae03745ae6768da908aad3c0e10b1c48b0de321ad5d7201',
      },
    });
    expect(result).toEqual(
      '0a20b2506d0e6a6f4901b85a4a9a57f30dc7acf95b9feba037566baedaf450a3b7be'
    );
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
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const requestManage = new RequestManager(httpProvider);
    const result = await requestManage.sendAsync({
      requestMethod: 'post',
      method: 'blockChain/executeTransaction',
      params: {
        RawTransaction:
          '0a220a203000800ce18e6de0fc576a48759d9dc90a23f0ded388316b0f9f1274a45b809b12220a202ec3700300ef9c95ee67a20a35dad35b8b0d476533e009a746b015df7d051e2d2a1c43616c63756c6174654f7267616e697a6174696f6e4164647265737332560a240a220a2024447d28d0da2f7923a917a4176214032541bda3d0d1a4c8195f3ecccc034fc7120808011000180020011a240a220a2024447d28d0da2f7923a917a4176214032541bda3d0d1a4c8195f3ecccc034fc782f104417582ebfba9506ec499b4ac36653f0c8feefa66d32eb0cd88ed4a608187c85fea75e37405c37de7d9bf3ae03745ae6768da908aad3c0e10b1c48b0de321ad5d7201',
      },
    });
    expect(result).toEqual(
      '0a20b2506d0e6a6f4901b85a4a9a57f30dc7acf95b9feba037566baedaf450a3b7be'
    );
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
