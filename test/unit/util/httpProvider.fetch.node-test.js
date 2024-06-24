import HttpProvider from '../../../src/util/httpProvider';
import http from 'node:http';
import https from 'node:https';
import { blockByHeightRes } from './httpProvider.data';
const fetch = require('node-fetch');
const stageEndpoint = 'https://aelf-public-node.aelf.io/';
// for test timeout
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('test httpProvider', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('test get request send by fetch', async () => {
    const httpProvider = new HttpProvider(stageEndpoint);
    const response = await httpProvider.requestSendByFetch(
      {
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 136240697,
        },
      },
      fetch
    );
    const result = await response.text();
    expect(JSON.parse(result)).toEqual(blockByHeightRes);
  });
  test('test get request send by fetch, keepalive', async () => {
    const httpAgent = new http.Agent({
      keepAlive: true
    });
    const httpsAgent = new https.Agent({
      keepAlive: true
    });
    const options = {
      agent: function(_parsedURL) {
        if (_parsedURL.protocol === 'http:') {
          return httpAgent;
        } else {
          return httpsAgent;
        }
      }
    };

    const httpProvider = new HttpProvider(stageEndpoint, 8000, {}, options);
    const response = await httpProvider.requestSendByFetch(
      {
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 136240697,
        },
      },
      fetch
    );
    const result = await response.text();
    expect(JSON.parse(result)).toEqual(blockByHeightRes);
  });
  test('test post request send by fetch', async () => {
    const httpProvider = new HttpProvider(stageEndpoint);
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
    expect(JSON.parse(result)).toMatchObject({
      Success: false,
      TransactionFee: null,
      ResourceFee: null,
    });
  });
  test('test send async by fetch', async () => {
    const httpProvider = new HttpProvider(stageEndpoint);
    const result = await httpProvider.sendAsyncByFetch({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 136240697,
      },
    });
    expect(result).toEqual(blockByHeightRes);
  });

  test('test send async by fetch when error', async () => {
    const httpProvider = new HttpProvider(stageEndpoint);
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'blockChain/executeTransaction',
        method: 'POST',
        params: {
          RawTransaction: '111',
        },
      })
    ).rejects.toEqual({
      Error: {
        Code: '20012',
        Message: 'Invalid params',
        Details: null,
        Data: {},
        ValidationErrors: null,
      },
    });
  });

  test('test send by fetch', () => {
    const httpProvider = new HttpProvider(stageEndpoint);
    try {
      httpProvider.send({
        url: 'blockChain/blockHeight',
        method: 'GET',
      });
    } catch (e) {
      expect(e).toEqual(
        new Error("Can not get XMLHttpRequest, invalid parameter: 'sync'")
      );
    }
  });

  test('test send async by fetch method', async () => {
    const httpProvider = new HttpProvider(stageEndpoint);
    const result = await httpProvider.sendAsync({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 136240697,
      },
    });
    expect(result).toEqual(blockByHeightRes);
  });
});
