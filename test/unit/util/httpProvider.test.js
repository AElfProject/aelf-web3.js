require('isomorphic-fetch');
import HttpProvider from '../../../src/util/httpProvider';
const stageEndpoint = 'https://explorer-test-tdvw.aelf.io/';
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

const blockByHeightRes = {
  BlockHash: 'f8bd119ae0a2a93913ad5104143cae05f71c9f4674b44462cfb39acf6e42f76d',
  Header: {
    PreviousBlockHash:
      'c9313e0db7962002df1ce90b367415c12be3ba0c963f864fe0f331c6a9af1294',
    MerkleTreeRootOfTransactions:
      '46d2955581d0d276fa42cd4928fd85a7c9935d4060b61afbebd5532008ad5b29',
    MerkleTreeRootOfWorldState:
      'd3306b3f048fd26f62249e7ba9c9c04560abb41ec1581a4efc046448975d8994',
    MerkleTreeRootOfTransactionState:
      '8601777b7246af5be7b3c31bd44c9826480f9785645ce216a709c1ce2da217ab',
    Extra:
      '{ "CrossChain": "", "Consensus": "CkEE80ryjmjXybz8epeXpNiU7pqdPRQuJ1zSVLZJXtfslflUEcmBmVDCPDb9AKLGEJR0h71uCz4+2NLJDwifpPDAKhL+FQin+W8SvQIKggEwNGYzNGFmMjhlNjhkN2M5YmNmYzdhOTc5N2E0ZDg5NGVlOWE5ZDNkMTQyZTI3NWNkMjU0YjY0OTVlZDdlYzk1Zjk1NDExYzk4MTk5NTBjMjNjMzZmZDAwYTJjNjEwOTQ3NDg3YmQ2ZTBiM2UzZWQ4ZDJjOTBmMDg5ZmE0ZjBjMDJhErUBOLOZA0qCATA0ZjM0YWYyOGU2OGQ3YzliY2ZjN2E5Nzk3YTRkODk0ZWU5YTlkM2QxNDJlMjc1Y2QyNTRiNjQ5NWVkN2VjOTVmOTU0MTFjOTgxOTk1MGMyM2MzNmZkMDBhMmM2MTA5NDc0ODdiZDZlMGIzZTNlZDhkMmM5MGYwODlmYTRmMGMwMmFqBgiki9afBmoLCKSL1p8GEPjF1HlqDAiki9afBhDUvL/FAYABA4gBt7z7QBKHAQqCATA0YTY2MDdiNzJmYTI2Zjg2NDRlOGUyNGExNmY2MWM3Y2I1NmM5Yzg1MGQzYmFhNTYwYmY0ZjgzN2MyZDk5MzUxMWZhNjk5NmQ2MGQ2YmRiZDQ4OGQ5Yjc0MzgxNDg2MGE5MzgxNjI3YTQ2OTc3ZWFkZjdjYzMyMzZkYzIxNmM4ZmMSABKHAQqCATA0NTRjMmU2MDVlNzkwZThjNmUyOTU2MDRlZWI2ZTE2OWFmOTdlMjU4NjI4ODJmNDRjYmZmMTk1MDIwOTZlMjk0NjBiNDI1ZTdjYjUwZGExMjE1YjU5MzEwNTdmYTg0ZGQ4MTJhNjZhMTVlYWQ0NmE2NmE5OTcyZDNlM2MzZmUzOGISABKHAQqCATA0ODA3NGNlY2E2YzdhNDJkYmRhOTM1NWNmZTFmMTQyM2YyYjUzOGVlNzE1NjczY2VjNzY0MTNmNDU2OTAxMjBhN2ZlOTM0MjU5ZDZlNTJhMDcxNGMzNzQ5MjkzODI4ZDY1MWYyNjE3YWIyYWNmMzJmYjRkZTYzM2MyZTUyMWFhZDcSABKHAQqCATA0MGRmYWQ3NzljY2FiZGExMjk0YWEyM2VjYjQwN2U2ZmMzZGVjNGI0Zjc4ODlmMGY3NjIxMzYxODUyMjFjNzI4ZWZjZGYzOTc2MzE3YzNkYTY2Mzg2YTVkOWU3Mzc2ZWFhNzIwMWE3YzE1Njk4YWZlYmFhOTU0MjZhZGIwM2JmZDISABKHAQqCATA0ZDRmZjkxZGYyMDJlYzkyMzA0MDEyYmEzMDFhYjI0ZGVjOTNmZWQzZTc3OTUwOGVmZTRkNjQ5MzU4ZTc0OTNlMjJlMzViYjJiMGE3ODk0ZGE4Mjk5NjJlZGI2MjUxYTFkNTkwNzFkNTRhYTA4Mjc4ZTg5YWFlNWNlZGEyYzA2YzUSABKHAQqCATA0MmY3Y2FiODI3MmUxZjRlOTBlNTllOTFiYmUyYzIxMWYxYTBlMTVhNWI2NzBhZmY1MTdhMDJmNjI1ZDY3ODYwN2E5NjcyM2I2Y2UzMjMyZmNmNmFkMGZjOTg4ZTNlMTk4Y2RlZGViY2MxMGNkNGQ4NmI0ZGRkZmQ4YTk5ZWRjZjASABKHAQqCATA0MmU5YWM5NzRkYTA4NWNiZmQyMTZlY2EwMmQxYTQ3ZjczYmJmMGFmNTVjMGIzNjQ3NGRjM2NmYzU0M2UzM2U0YWRlNDA3YzgyZGRlZDRhNmVmODYwNzZhMTY0ZGExMWM5OWE5MDhlYWE1NmI5NzdjNDc3M2RlOTA3Y2EwYjA4MTQSABKHAQqCATA0NzZkMDcyMjZkZjU0YmMzZjBjYmJmNmFiODZmNWM5ZDIzMjQ4NjBlOWUzYzM2ZGIyODg2NTU1ZDc4MzJlZWQ4OTIxNGY3M2RmZThjNDNlN2VmZGQ3MTU3ZGZiYjE0ODk2Njk0NGZiY2IxYWQwYmY4MTJiNmQzMzUwODU4ZTkxMDQSABKHAQqCATA0OTUzNmJlYzNkNzM0MWNjZGNlMGQ5MjlhMWEyZGY2MzM3OTQyYzljMDg2NmJiM2UzMzYxNTI4MTVkYjVkNzBhNmM5OTM5NjQwZDU1ZGM4MDQ5YzI2NmJiNGI0ZDM5NzY5Y2U2YTk0MmRjMTU5MWFiMmRhNmYxOWNmZjlhMzcxMjkSABKHAQqCATA0NThhZDJlYzRkODk0NGJmZjdmM2FiN2I1NmE5MGZmY2E3ODRiMDYzMmJkZjhjNGE5NTJkYTE1M2IyNGIzZmJiZGE1NDMyZjVlZjI5M2FiN2NlZDc5MTk2OWY1ZmUwMmIwYjVlNmJjNWFmN2NlMDc0YTlkYzM4NmM4ZGFiMGU2ZGISABKHAQqCATA0ZDQwNTJhOTdlZWI4YmQzMDU0ZmJiMGYzZjllYjllOGQ5NWQ0ZWM2NjQ4MmYyMjI3ZDA2NGJlNDVjYTA3ZDczY2RiODMzM2EyNWMxODE2OTVhMjZhZWE5YWVlYmQ2N2VjNTkzYmZiYTliYzlmM2MzZDVhMzFkNjcxZjdhYmJjYWMSABKHAQqCATA0MThhMzM2ZjQ4NGY5OTBkOTcxYmFjOGM4M2M4MWJiY2IwNzg2ZmQ0ZTY3OTUzODYxZmMzOWYyZmUwNTY0Nzc3ZGM0ZTI0YmRhZTUyM2VkNzE5NjcwZjBkZDk5OGRjNDc0MTA4YjBmZDU1MTBjYzY1NzI3ODI4ZDk0MWM1OWYwZTkSABKHAQqCATA0MzFiYmZkYmJiNzI1Njk0ODAzNWEyN2NhN2MwOGFlZGI1N2YyMzVjNTFhNzlkZDEzNDcwN2ExYTVmNWM3ODY3NDY5MDViNTljYjcxN2ZiNzVjOWQzNTk1MGM5NTg4NDcyNzk4ZTY3MjkwY2NjY2U0MDk5M2FlN2JkMmNjMjY3MGMSABKHAQqCATA0ZDIxY2I2MTRkMGMyZmFhZGM0YWE5OWY1YjgxZjU1YWRhM2Y2NWM1ZjJhNGE3ZWI2MzkyNzhiYzU5ZGFjNDJiMGNkZTlkNzBkZmVhZDBjNjIwMTNhNTNlYzc0NjZjYWQ2NjM5NjQ5NjA3MjYyNGJlNmUwMmE5MmI1NDkyOGUwMzISABKHAQqCATA0YzcxMzJhOTFkM2IzOTI0ZDFhZmNmOTliMjU1ZGRlNWZjMGZiYjQzN2U4Y2IzYjBkMzg1OGU5YmJiZjdmMzBlMmUzOWUzODE5ZWJiOWYwMzQ5NjNiNmE3ZWQzZTNjMTJlODUyOGNmY2U2MjEwZjM5Y2YxMjgwM2Y4OTg3N2E4OTASABKHAQqCATA0OTAzZDY3NGE0YzVmOWE4NGJkMGM1MWYwNDZiYzhiYzRhYjE1YjFmZTlmMGM0YTIyY2E5MmQxNDA0ZjIyZTNjN2Q4OTY5YTRlNmRjZDA3NWM0Y2E4YzcxNGViZjVhNWZjY2JlZWVhNTkyODM4Y2RmM2I5MzU2MjQ4NDA4MTg0MGISABKHAQqCATA0MTY5ODY4YjdjY2M0ODIyZjI3YWZkNjQ5N2E5NGYyODA0OGE0ZjNiZmI5ODAyYzJkNzBkODQ3NzFkODEwNjJiMGJjMWEyNWM5YzFkZGFkMjVjODg4YmViYTBiODllYzBiZDcyOTAyMmVhMjlmNDI4ZDdjYjc0MDUzZTM5ZTFmMWYSABKHAQqCATA0OWQ4ZDZiOGI3OGI2MDRkOWE4NDA2MTM4NzVmZWQyYjkwNDhmYTBmZWYxZTA5ZjQ5NmUxYTExYjJhNzAxZGE3NDZiMWFmZTU0ZGVmMDJmMmZmYTBiOGNjNDFhN2NjNzQxZDVmMzU2YjYxZDE1NjEzOGI1MGQ0NWVkZmI5N2I2NzcSAFDk0uPZdhgE", "SystemTransactionCount": "CAI=" }',
    Height: 136240697,
    Time: '2023-02-22T03:01:56.4141789Z',
    ChainId: 'AELF',
    Bloom:
      'AAAAAAAAAAIAAAAAAAAAIABAAAAAAAgAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAACAABAAAAAAAAAAAAAAAAAAAAAAAAACACAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAABAAAAAAgAAAAABAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAgAAAAAAAAAAAAAAAA==',
    SignerPubkey:
      '04f34af28e68d7c9bcfc7a9797a4d894ee9a9d3d142e275cd254b6495ed7ec95f95411c9819950c23c36fd00a2c610947487bd6e0b3e3ed8d2c90f089fa4f0c02a',
  },
  Body: {
    TransactionsCount: 2,
    Transactions: [],
  },
  BlockSize: 3589,
};
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
    expect(httpProvider.headers['Last-Modified']).toEqual(
      'Wed, 21 Oct 2015 07:28:00 GMT'
    );
  });
  test('test headers are Object', () => {
    const httpProvider = new HttpProvider(stageEndpoint, 8000, {
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
  test('test timeout', async () => {
    const p = HttpProvider.timeoutPromise(3000);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000);
    jest.runAllTimers();
    return expect(p).resolves.toEqual({ type: 'timeout' });
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
    expect(JSON.parse(result)).toEqual({
      id: 43735856,
      block_hash:
        '28ab301869791fe34b20747e77d18b364997d647ebd13acd9337a7359c92df06',
      pre_block_hash:
        '2270f9afe57f1ab3e99277c0a177f42ac9690de6eb4dc049e5f921ed740703af',
      chain_id: 'tDVW',
      dividends: '{}',
      miner: 'szJDnSZaPBesgzD9ZS3EFaRyUbj2z3YPTzXtcW6MX27AvF4CM',
      tx_fee: '{}',
      resources: '{}',
      block_height: 43143609,
      tx_count: 2,
      merkle_root_tx:
        'e4edc1c356a120027d817b801d1f191fabe0a23188611ca6d38f884984e122fc',
      merkle_root_state:
        'd05386093ff74cde09c6144b8e5acae824710a103c1333dd797c088841b470f5',
      time: '2023-02-21T06:25:49.1205547Z',
    });
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
    expect(JSON.parse(result)).toEqual({
      Success: false,
      TransactionFee: null,
      ResourceFee: null,
    });
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
    expect(result).toEqual({
      list: [
        {
          id: 1,
          contract_address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
          chain_id: 'tDVW',
          api_ip: 'http://127.0.0.1:7102',
          api_domain: 'http://127.0.0.1:7102',
          rpc_ip: 'http://172.31.28.116:8000',
          rpc_domain: 'http://172.31.28.116:8000',
          token_name: 'ELF',
          owner: 'owner',
          status: 1,
          create_time: '2022-06-09T06:52:13.000Z',
        },
      ],
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
    expect(JSON.parse(result)).toEqual({
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
    expect(result).toEqual(blockByHeightRes);
  });
  test('test send async by fetch method', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    window.fetch = fetch;
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    const result = await httpProvider.sendAsync({
      url: 'nodes/info',
      method: 'GET',
    });
    expect(result).toEqual({
      list: [
        {
          id: 1,
          contract_address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
          chain_id: 'tDVW',
          api_ip: 'http://127.0.0.1:7102',
          api_domain: 'http://127.0.0.1:7102',
          rpc_ip: 'http://172.31.28.116:8000',
          rpc_domain: 'http://172.31.28.116:8000',
          token_name: 'ELF',
          owner: 'owner',
          status: 1,
          create_time: '2022-06-09T06:52:13.000Z',
        },
      ],
    });
  });
  test('test send async by xhr method', async () => {
    const httpProvider = new HttpProvider('https://aelf-public-node.aelf.io');
    const result = await httpProvider.sendAsync({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 136240697,
      },
    });
    expect(result).toEqual(blockByHeightRes);
  });
  test('test send async by xhr', async () => {
    const httpProvider = new HttpProvider('https://aelf-public-node.aelf.io');
    const result = await httpProvider.sendAsyncByXMLHttp({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 136240697,
      },
    });
    expect(result).toEqual(blockByHeightRes);
  });
  test('test send async by xhr when error', async () => {
    const httpProvider = new HttpProvider(stageEndpoint);
    expect(
      httpProvider.sendAsyncByXMLHttp({
        url: 'nodes/info',
        method: 'POST',
      })
    ).rejects.toEqual('<h2>403 Forbidden</h2>');
  });
  test('test is connected', () => {
    const httpProvider = new HttpProvider('https://aelf-public-node.aelf.io');
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
    const httpProvider = new NewHttpProvider(
      'https://aelf-public-node.aelf.io'
    );
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
