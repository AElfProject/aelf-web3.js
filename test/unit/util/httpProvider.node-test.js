import HttpProvider from '../../../src/util/httpProvider';
import { tdvwEndPoint } from '../constant';
import { blockByHeightRes } from './httpProvider.data';
// for test timeout
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

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
        value: 'Wed, 21 Oct 2015 07:28:00 GMT'
      }
    ]);
    expect(httpProvider.headers['Last-Modified']).toEqual('Wed, 21 Oct 2015 07:28:00 GMT');
  });
  test('test headers are Object', () => {
    const httpProvider = new HttpProvider(tdvwEndPoint, 8000, {
      'Last-Modified': 'Wed, 21 Oct 2015 07:28:00 GMT'
    });
    expect(httpProvider.headers['Last-Modified']).toEqual('Wed, 21 Oct 2015 07:28:00 GMT');
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
      statusText: 'server error'
    });
    expect(response).toEqual({
      Error: { message: 'server error' },
      error: 500,
      status: 500,
      statusText: 'server error'
    });
  });
  test('test format response text with status 200', () => {
    const response = HttpProvider.formatResponseText({
      status: 200
    });
    expect(response.error).toEqual(0);
  });
  test('test format response text when param is not object', () => {
    const response = HttpProvider.formatResponseText('status: 200');
    expect(response).toEqual({
      Error: { message: undefined },
      error: undefined,
      status: undefined,
      statusText: undefined
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
  test('test get request send by xhr', () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const RequestLibrary = require('xmlhttprequest').XMLHttpRequest;
    const request = new RequestLibrary();
    request.withCredentials = false;
    httpProvider.requestSend(
      {
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 134573331
        }
      },
      request
    );
    const result = JSON.parse(request.responseText);
    expect(result).toEqual(blockByHeightRes);
  });

  test('test post request send by xhr', () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const RequestLibrary = require('xmlhttprequest').XMLHttpRequest;
    const request = new RequestLibrary();
    request.withCredentials = false;
    httpProvider.requestSend(
      {
        url: 'blockChain/calculateTransactionFee',
        params: {
          RawTransaction:
            '0a220a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb275468212220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba18a8a19e022204fa60011c2a085472616e73666572322e0a220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba1203454c461880c2d72f82f10441ad1647aa462a8859c7a699f22d6124c82a5239c90746ac67ebfd8e1a7b4a25f343733351162d205fc881ea62072e9fe0fad5f6113734309b6666f6812d6b7a6400'
        }
      },
      request
    );
    const result = request.responseText;
    expect(JSON.parse(result)).toMatchObject({
      Success: false,
      TransactionFee: null,
      ResourceFee: null
    });
  });

  test('test send by xhr', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const result = httpProvider.send({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 134573331
      }
    });
    expect(result).toEqual(blockByHeightRes);
  });
  test('test send by xhr when error', async () => {
    const xhrMockClass = () => ({
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      responseText: {
        Error: 'error xhr'
      }
    });

    HttpProvider.__Rewire__('RequestLibrary', jest.fn().mockImplementation(xhrMockClass));
    const httpProvider = new HttpProvider(tdvwEndPoint);
    try {
      httpProvider.send({
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 134573331
        }
      });
    } catch (e) {
      expect(e).toEqual({ Error: 'error xhr' });
    }
    HttpProvider.__ResetDependency__('RequestLibrary');
  });
  test('test send async by xhr method', async () => {
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
  test('test send async by xhr', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    const result = await httpProvider.sendAsyncByXMLHttp({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 134573331
      }
    });
    expect(result).toEqual(blockByHeightRes);
  });
  test('test send async by xhr when error', async () => {
    const httpProvider = new HttpProvider(tdvwEndPoint);
    await expect(
      httpProvider.sendAsyncByXMLHttp({
        url: 'blockChain/executeTransaction',
        method: 'POST'
      })
    ).rejects.toEqual({
      Error: {
        Code: '20012',
        Data: {},
        Details: null,
        Message: 'Invalid params',
        ValidationErrors: null
      }
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
  test('test is not connected when async', async () => {
    const httpProvider = new HttpProvider('https://explorer-test-tdvv.aelf.io');
    const result = await httpProvider.isConnectedAsync();
    expect(result).toBeFalsy();
  });
});
