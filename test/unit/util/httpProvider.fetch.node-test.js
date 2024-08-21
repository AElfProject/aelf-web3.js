import HttpProvider from '../../../src/util/httpProvider';
import http from 'node:http';
import https from 'node:https';
import { blockByHeightRes } from './httpProvider.data';
import { tdvwEndPoint } from '../constant';
const fetch = require('node-fetch');
// for test timeout
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('test httpProvider', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('test get request send by fetch', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const response = await httpProvider.requestSendByFetch(
      {
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 134573331
        }
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
      agent: function (_parsedURL) {
        if (_parsedURL.protocol === 'http:') {
          return httpAgent;
        } else {
          return httpsAgent;
        }
      }
    };

    const httpProvider = new HttpProvider(tdvwEndPoint, 8000, {}, options);
    const response = await httpProvider.requestSendByFetch(
      {
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 134573331
        }
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
            '0a220a203000800ce18e6de0fc576a48759d9dc90a23f0ded388316b0f9f1274a45b809b12220a202ec3700300ef9c95ee67a20a35dad35b8b0d476533e009a746b015df7d051e2d2a1c43616c63756c6174654f7267616e697a6174696f6e4164647265737332560a240a220a2024447d28d0da2f7923a917a4176214032541bda3d0d1a4c8195f3ecccc034fc7120808011000180020011a240a220a2024447d28d0da2f7923a917a4176214032541bda3d0d1a4c8195f3ecccc034fc782f104417582ebfba9506ec499b4ac36653f0c8feefa66d32eb0cd88ed4a608187c85fea75e37405c37de7d9bf3ae03745ae6768da908aad3c0e10b1c48b0de321ad5d7201'
        }
      },
      fetch
    );
    const result = await response.text();
    expect(result).toEqual('0a20b2506d0e6a6f4901b85a4a9a57f30dc7acf95b9feba037566baedaf450a3b7be');
  });
  test('test send async by fetch', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const result = await httpProvider.sendAsyncByFetch({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 134573331
      }
    });
    expect(result).toEqual(blockByHeightRes);
  });

  test('test send async by fetch when error', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'blockChain/executeTransaction',
        method: 'POST',
        params: {
          RawTransaction: '111'
        }
      })
    ).rejects.toEqual({
      Error: {
        Code: '20012',
        Message: 'Invalid params',
        Details: null,
        Data: {},
        ValidationErrors: null
      }
    });
  });

  test('test send by fetch', () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    try {
      httpProvider.send({
        url: 'blockChain/blockHeight',
        method: 'GET'
      });
    } catch (e) {
      expect(e).toEqual(new Error("Can not get XMLHttpRequest, invalid parameter: 'sync'"));
    }
  });

  test('test send async by fetch method', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const result = await httpProvider.sendAsync({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 134573331
      }
    });
    expect(result).toEqual(blockByHeightRes);
  });
});
