require('isomorphic-fetch');
import HttpProvider from '../../../src/util/httpProvider';
const stageEndpoint = 'https://explorer-test-tdvw.aelf.io/';

describe('test httpProvider', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('test headers are Array', () => {
    const httpProvider = new HttpProvider(stageEndpoint, 8000, [
      {
        name: 'Last-Modified',
        value: 'Wed, 21 Oct 2015 07:28:00 GMT',
      },
    ]);
  });
  test('test headers are Object', () => {
    const httpProvider = new HttpProvider(stageEndpoint, 8000, {
      'Last-Modified': 'Wed, 21 Oct 2015 07:28:00 GMT',
    });
    // console.log(httpProvider);
  });
  test('test get request send by fetch', async () => {
    const httpProvider = new HttpProvider(stageEndpoint);
    const response = await httpProvider.requestSendByFetch(
      {
        url: 'block/blockInfo',
        method: 'GET',
        params: {
          height: 43143609,
        },
      },
      fetch
    );
    const result = await response.text();
  });
  test('test post request send by fetch', async () => {
    const httpProvider = new HttpProvider('https://aelf-public-node.aelf.io');
    const response = await httpProvider.requestSendByFetch(
      {
        url: 'blockChain/calculateTransactionFee',
        params: {
          RawTransaction:
            '0a220a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb275468212220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba18a8a19e022204fa60011c2a085472616e73666572322e0a220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba1203454c461880c2d72f82f10441ad1647aa462a8859c7a699f22d6124c82a5239c90746ac67ebfd8e1a7b4a25f343733351162d205fc881ea62072e9fe0fad5f6113734309b6666f6812d6b7a6400',
        },
      },
      fetch
    );
    const result = await response.text();
  });
  test('test send async by fetch', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    window.fetch = fetch;
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    const result = await httpProvider.sendAsyncByFetch({
      url: 'nodes/info',
      method: 'GET',
    });
  });
  test('test send async by fetch when error', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    window.fetch = fetch;
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    expect(
      httpProvider.sendAsyncByFetch({
        url: 'nodes/info',
        method: 'POST',
      })
    ).rejects.toEqual('<h2>403 Forbidden</h2>');
  });
  test('test get request send by xhr', () => {
    const httpProvider = new HttpProvider('https://aelf-public-node.aelf.io');
    const RequestLibrary = window.XMLHttpRequest;
    const request = new RequestLibrary();
    request.withCredentials = false;
    httpProvider.requestSend(
      {
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 136240697,
        },
      },
      request
    );
    const result = JSON.parse(request.responseText);
    expect(result.BlockHash).toBe(
      'f8bd119ae0a2a93913ad5104143cae05f71c9f4674b44462cfb39acf6e42f76d'
    );
  });

  test('test post request send by xhr', () => {
    const httpProvider = new HttpProvider('https://aelf-public-node.aelf.io');
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
  });

  test('test send by fetch', () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    window.fetch = fetch;
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(stageEndpoint);
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
    const httpProvider = new HttpProvider('https://aelf-public-node.aelf.io');
    const result = httpProvider.send({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 136240697,
      },
    });
    expect(result.BlockHash).toBe(
      'f8bd119ae0a2a93913ad5104143cae05f71c9f4674b44462cfb39acf6e42f76d'
    );
  });
});
