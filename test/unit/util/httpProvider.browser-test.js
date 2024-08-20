require('isomorphic-fetch');
import HttpProvider from '../../../src/util/httpProvider';
import { tdvwEndPoint } from '../constant';
// for test timeout
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

const blockByHeightRes = {
  BlockHash: '2267716b9af2d6c306ded8eb992ce04518ec965704298c80e10df4b4e5358eb5',
  Header: {
    PreviousBlockHash:
      'c6d1142ab62e6a9d8ed1c09387c93a85698782e9fff6c3ab0580816a2c9456e0',
    MerkleTreeRootOfTransactions:
      '56403fb4c93574713d4b22f2ed8159aa1933350f5daa113865b6de159330cc92',
    MerkleTreeRootOfWorldState:
      'cbf8816225d99877a840170ab8ced2e1e7a926b8fd622ba99b5871fcf727033a',
    MerkleTreeRootOfTransactionState:
      'c16938414dbfc92c696beef5eafc04cd01d9293f2c04e6eb61e389a9d73c05b2',
    Extra:
      '{ "CrossChain": "", "Consensus": "CkEEh7sZKR/nG9P42M8dRuG6fQXzDijZH+PU4kitRuRYH9KmU87BI7Eqj2hQ4sGVLIspYWNZ+fpHUtS+xp2SoTpEURL6Bgis0rEBEsQCCoIBMDQ4N2JiMTkyOTFmZTcxYmQzZjhkOGNmMWQ0NmUxYmE3ZDA1ZjMwZTI4ZDkxZmUzZDRlMjQ4YWQ0NmU0NTgxZmQyYTY1M2NlYzEyM2IxMmE4ZjY4NTBlMmMxOTUyYzhiMjk2MTYzNTlmOWZhNDc1MmQ0YmVjNjlkOTJhMTNhNDQ1MRK8ATiAnNcGSoIBMDQ4N2JiMTkyOTFmZTcxYmQzZjhkOGNmMWQ0NmUxYmE3ZDA1ZjMwZTI4ZDkxZmUzZDRlMjQ4YWQ0NmU0NTgxZmQyYTY1M2NlYzEyM2IxMmE4ZjY4NTBlMmMxOTUyYzhiMjk2MTYzNTlmOWZhNDc1MmQ0YmVjNjlkOTJhMTNhNDQ1MWoLCMiWkbYGEMiAiW9qDAjIlpG2BhDkjNHmAWoMCMiWkbYGEPTPm8cCgAEDiAGR2pVAEocBCoIBMDQ1Mjc2MmVjMjFmZWQyOWY0Y2I4NmRmM2ZjMDhmMDJhMjM4NWM4NGQ0NWRmZDRlZjU0MDA1OTczYjQxZjVhYjI2NGUyZTVkZTBkNDZlYzQ1ZTY0OTFiOTgxMDUwMzgwYjBhYTE5NzE0YWY0ZjA4Nzg1NjAzMjE4OTNlNjI2MzFlNBIAEocBCoIBMDQ3Nzk0ZTViNDI0MTc3YmYwM2Y5ZDVlNTQxZTdiZGEyODA1NjIwOWQ4MTRjNjhhZWQyNjcwZTQ2ZDk2M2M4NWQwNGRhNWY2OWVmODI0NThlODYxNzQ4OTA3NDM5ODVlMjk3ODQzNDg1YjEwZDAyOTVmYzI4Yjg4NTMzNTVjZmI4YhIAEocBCoIBMDRkNDViOTMwODI5OWQ4YzIyZmE1N2UyZmMxNzU1Yzc1YzUzNmEyMzJjMzA0MDMyNTdjYWMxOThkN2FmMzBhZWNkZGE4NWQyODc1YzQ1YWQ4Nzk1MGZhZGIzNGEyNjkyMGUzOTAwOGRhZGVmYzhlZWU5YzYxYzJmZThmNjY0MDBlMxIAEocBCoIBMDQzNTdiMWFkOGMwNTc2ZDI2YWEzZDZiMmQwOWIyYWQwM2JmNWRiY2UyMjM3MzA2MzYxNDVjZjQ0M2ZlYjM3ZmIxOTE1NmI5OTE5NGZhNDhhZDkyNTY2Yjk1YzQ1NDkzOWRmMmNhNzFlOWJmNTE3YzI1OTBjMmVlZGRkNzZjZjkxZRIAUJDx1Y4gGAQ=", "SystemTransactionCount": "CAI=" }',
    Height: 134573331,
    Time: '2024-08-20T07:52:40.6862213Z',
    ChainId: 'tDVW',
    Bloom:
      'AAAAAAAAAAAAAAAAAAIAAABAAAAAAAAAAAAAAAAAAACAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAACAAAAAABAAAAAAAAAAAAQCAAAAAAAAAAACACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAQAAAAAEAAAAAIEAIAAAEAAAAAAEAAAAACAAAAAA==',
    SignerPubkey:
      '0487bb19291fe71bd3f8d8cf1d46e1ba7d05f30e28d91fe3d4e248ad46e4581fd2a653cec123b12a8f6850e2c1952c8b29616359f9fa4752d4bec69d92a13a4451',
  },
  Body: {
    TransactionsCount: 2,
    Transactions: [],
  },
  BlockSize: 1664,
};
describe('test httpProvider', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('test host default', () => {
    const httpProvider = new HttpProvider();
    expect(httpProvider.host).toBe('http://localhost:8545');
  });
  test('test headers are Array', () => {
    const httpProvider = new HttpProvider(tdvwEndPoint, 8000, [
      {
        name: 'Last-Modified',
        value: 'Wed, 21 Oct 2015 07:28:00 GMT',
      },
    ]);
    expect(httpProvider.headers['Last-Modified']).toEqual(
      'Wed, 21 Oct 2015 07:28:00 GMT'
    );
  });
  test('test headers are Object', () => {
    const httpProvider = new HttpProvider(tdvwEndPoint, 8000, {
      'Last-Modified': 'Wed, 21 Oct 2015 07:28:00 GMT',
    });
    expect(httpProvider.headers['Last-Modified']).toEqual(
      'Wed, 21 Oct 2015 07:28:00 GMT'
    );
  });
  test('test format response when can parse to JSON', () => {
    const response = HttpProvider.formatResponse('{"ok":true,"status":200}');
    expect(response).toEqual({ ok: true, status: 200 });
  });
  test('test format response when cannot parse to JSON', () => {
    const response = HttpProvider.formatResponse('status: 200');
    expect(response).toEqual('status: 200');
  });
  test('test format response text with status and statusText', () => {
    const response = HttpProvider.formatResponseText({
      status: 500,
      statusText: 'server error',
    });
    expect(response).toEqual({
      Error: { message: 'server error' },
      error: 500,
      status: 500,
      statusText: 'server error',
    });
  });
  test('test format response text with status 200', () => {
    const response = HttpProvider.formatResponseText({
      status: 200,
    });
    expect(response.error).toEqual(0);
  });
  test('test format response text when param is not object', () => {
    const response = HttpProvider.formatResponseText('status: 200');
    expect(response).toEqual({
      Error: { message: undefined },
      error: undefined,
      status: undefined,
      statusText: undefined,
    });
  });
  test('test format response text when error', () => {
    const response = HttpProvider.formatResponseText(null);
    expect(response).toEqual(null);
  });
  test('test timeout', async () => {
    const p = HttpProvider.timeoutPromise(3000);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000);
    jest.runAllTimers();
    return expect(p).resolves.toEqual({ type: 'timeout' });
  });
  test('test get request send by fetch', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const response = await httpProvider.requestSendByFetch(
      {
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 134573331,
        },
      },
      fetch
    );
    const result = await response.text();
    expect(JSON.parse(result)).toEqual(blockByHeightRes);
  });
  test('test post request send by fetch', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const response = await httpProvider.requestSendByFetch(
      {
        url: 'blockChain/executeTransaction',
        params: {
          RawTransaction:
            '0a220a203000800ce18e6de0fc576a48759d9dc90a23f0ded388316b0f9f1274a45b809b12220a202ec3700300ef9c95ee67a20a35dad35b8b0d476533e009a746b015df7d051e2d2a1c43616c63756c6174654f7267616e697a6174696f6e4164647265737332560a240a220a2024447d28d0da2f7923a917a4176214032541bda3d0d1a4c8195f3ecccc034fc7120808011000180020011a240a220a2024447d28d0da2f7923a917a4176214032541bda3d0d1a4c8195f3ecccc034fc782f104417582ebfba9506ec499b4ac36653f0c8feefa66d32eb0cd88ed4a608187c85fea75e37405c37de7d9bf3ae03745ae6768da908aad3c0e10b1c48b0de321ad5d7201',
        },
      },
      fetch
    );
    const result = await response.text();
    expect(result).toEqual(
      '0a20b2506d0e6a6f4901b85a4a9a57f30dc7acf95b9feba037566baedaf450a3b7be'
    );
  });
  test('test send async by fetch', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    window.fetch = fetch;
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(tdvwEndPoint);
    window.XMLHttpRequest = xhr;
    const result = await httpProvider.sendAsyncByFetch({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 134573331,
      },
    });
    expect(result).toEqual(blockByHeightRes);
  });
  test('test send async by fetch when no AbortController', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    const abortController = global.AbortController;
    delete global.AbortController;
    const originFetch = fetch;
    window.fetch = jest.fn(() =>
      Promise.resolve({
        type: 'timeout',
      })
    );
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(tdvwEndPoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'nodes/info',
        method: 'GET',
      })
    ).rejects.toEqual({
      type: 'timeout',
    });
    global.AbortController = abortController;
  });
  test('test send async by fetch without result.text', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    const originFetch = fetch;
    window.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(tdvwEndPoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'nodes/info',
        method: 'GET',
      })
    ).rejects.toEqual(TypeError('result.text is not a function'));
  });
  test('test send async by fetch when reject', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    const originFetch = fetch;
    window.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.reject('failed when reject'),
      })
    );
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(tdvwEndPoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'nodes/info',
        method: 'GET',
      })
    ).rejects.toEqual('failed when reject');
  });
  test('test send async by fetch when timeout', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    const originFetch = fetch;
    window.fetch = jest.fn(() =>
      Promise.resolve({
        type: 'timeout',
      })
    );
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(tdvwEndPoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'nodes/info',
        method: 'GET',
      })
    ).rejects.toEqual({
      type: 'timeout',
    });
  });
  test('test send async by fetch when status is not 200', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    const originFetch = fetch;
    window.fetch = jest.fn(() =>
      Promise.resolve({
        status: 400,
        text: () => Promise.resolve('failed when status is not 200'),
      })
    );
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(tdvwEndPoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'nodes/info',
        method: 'GET',
      })
    ).rejects.toEqual('failed when status is not 200');
  });
  test('test send async by fetch when result is not ok', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    const originFetch = fetch;
    window.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('failed when result is not ok'),
      })
    );
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(tdvwEndPoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'nodes/info',
        method: 'GET',
      })
    ).rejects.toEqual('failed when result is not ok');
  });
  test('test get request send by xhr', () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const RequestLibrary = window.XMLHttpRequest;
    const request = new RequestLibrary();
    request.withCredentials = false;
    httpProvider.requestSend(
      {
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 134573331,
        },
      },
      request
    );
    const result = JSON.parse(request.responseText);
    expect(result.BlockHash).toBe(
      '2267716b9af2d6c306ded8eb992ce04518ec965704298c80e10df4b4e5358eb5'
    );
  });

  test('test post request send by xhr', () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const RequestLibrary = window.XMLHttpRequest;
    const request = new RequestLibrary();
    request.withCredentials = false;
    httpProvider.requestSend(
      {
        url: 'blockChain/calculateTransactionFee',
        params: {
          RawTransaction:
            '0a220a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb275468212220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba18a8a19e022204fa60011c2a085472616e73666572322e0a220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba1203454c461880c2d72f82f10441ad1647aa462a8859c7a699f22d6124c82a5239c90746ac67ebfd8e1a7b4a25f343733351162d205fc881ea62072e9fe0fad5f6113734309b6666f6812d6b7a6400',
        },
      },
      request
    );
    const result = request.responseText;
    expect(JSON.parse(result)).toMatchObject({
      Success: false,
      TransactionFee: null,
      ResourceFee: null,
    });
  });

  test('test send by fetch', () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    window.fetch = fetch;
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(tdvwEndPoint);
    window.XMLHttpRequest = xhr;
    try {
      httpProvider.send({
        url: 'nodes/info',
        method: 'GET',
      });
    } catch (e) {
      expect(e).toEqual(
        new Error("Can not get XMLHttpRequest, invalid parameter: 'sync'")
      );
    }
  });

  test('test send by xhr', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const result = httpProvider.send({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 134573331,
      },
    });
    expect(result).toEqual(blockByHeightRes);
  });
  test('test send by xhr when error', async () => {
    const xhrMockClass = () => ({
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      responseText: {
        Error: 'error xhr',
      },
    });
    const xhr = window.XMLHttpRequest;
    window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(tdvwEndPoint);
    window.XMLHttpRequest = xhr;
    try {
      httpProvider.send({
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 134573331,
        },
      });
    } catch (e) {
      expect(e).toEqual({ Error: 'error xhr' });
    }
  });
  test('test send async by fetch method', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    window.fetch = fetch;
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(tdvwEndPoint);
    window.XMLHttpRequest = xhr;
    const result = await httpProvider.sendAsync({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 134573331,
      },
    });
    expect(result).toEqual(blockByHeightRes);
  });
  test('test send async by xhr method', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const result = await httpProvider.sendAsync({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 134573331,
      },
    });
    expect(result).toEqual(blockByHeightRes);
  });
  test('test send async by xhr', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const result = await httpProvider.sendAsyncByXMLHttp({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 134573331,
      },
    });
    expect(result).toEqual(blockByHeightRes);
  });
  test('test send async by xhr when error', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    await expect(
      httpProvider.sendAsyncByXMLHttp({
        url: 'blockChain/executeTransaction',
        method: 'POST',
      })
    ).rejects.toEqual({
      Error: {
        Code: '20012',
        Data: {},
        Details: null,
        Message: 'Invalid params',
        ValidationErrors: null,
      },
    });
  });
  test('test is connected', () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const result = httpProvider.isConnected();
    expect(result).toBeTruthy();
  });
  test('test is not connected', () => {
    const httpProvider = new HttpProvider('https://explorer-test-tdvv.aelf.io');
    const result = httpProvider.isConnected();
    expect(result).toBeFalsy();
  });
  test('test is connected when async', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    window.fetch = fetch;
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(tdvwEndPoint);
    window.XMLHttpRequest = xhr;
    const result = await httpProvider.isConnectedAsync();
    expect(!!result).toBeTruthy();
  });
  test('test is not connected when async', async () => {
    const httpProvider = new HttpProvider('https://explorer-test-tdvv.aelf.io');
    const result = await httpProvider.isConnectedAsync();
    expect(result).toBeFalsy();
  });
});
