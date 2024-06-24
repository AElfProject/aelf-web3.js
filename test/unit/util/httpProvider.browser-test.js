require('isomorphic-fetch');
import HttpProvider from '../../../src/util/httpProvider';
const stageEndpoint = 'https://aelf-public-node.aelf.io/';
// for test timeout
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
  test('test host default', () => {
    const httpProvider = new HttpProvider();
    expect(httpProvider.host).toBe('http://localhost:8545');
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
    const httpProvider = new HttpProvider(stageEndpoint);
    const response = await httpProvider.requestSendByFetch(
      {
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 43143609,
        },
      },
      fetch
    );
    const result = await response.text();
    expect(JSON.parse(result)).toEqual({
      BlockHash:
        'a09208b234f667329fb51e42be085f20f86bfcd9ddd7ce4d98d24bdb3d610bfc',
      Header: {
        PreviousBlockHash:
          '40105e35140c2884148ee4d7dce5d7867850f165c6da44265787b377784e99d8',
        MerkleTreeRootOfTransactions:
          '1c9b53dbd5f42ccceca7c10215867874986e3a75f1d0279fd8f6a152f98e18f8',
        MerkleTreeRootOfWorldState:
          'abf773002dbc0aa29e64064e6773bfe51cf23951adf4cb5bd3eda760a760a409',
        MerkleTreeRootOfTransactionState:
          'c4084bd442913ba4b05f4552f3532755ccd23719fe381d5b97f10775f476f6c8',
        Extra:
          '{ "CrossChain": "", "Consensus": "CkEEWXakIxZReEEb+GIDju1ttbFuBKqigwGmHH7jPhl/Pppe16l10NTsk22Bu4ErYSm68mBE6TdS6O5QjXzKWph2eBK3BwjlgzgSggMKggEwNDU5NzZhNDIzMTY1MTc4NDExYmY4NjIwMzhlZWQ2ZGI1YjE2ZTA0YWFhMjgzMDFhNjFjN2VlMzNlMTk3ZjNlOWE1ZWQ3YTk3NWQwZDRlYzkzNmQ4MWJiODEyYjYxMjliYWYyNjA0NGU5Mzc1MmU4ZWU1MDhkN2NjYTVhOTg3Njc4EvoBONyXBkqCATA0NTk3NmE0MjMxNjUxNzg0MTFiZjg2MjAzOGVlZDZkYjViMTZlMDRhYWEyODMwMWE2MWM3ZWUzM2UxOTdmM2U5YTVlZDdhOTc1ZDBkNGVjOTM2ZDgxYmI4MTJiNjEyOWJhZjI2MDQ0ZTkzNzUyZThlZTUwOGQ3Y2NhNWE5ODc2NzhqBgjI+IeJBmoLCMj4h4kGEOi0kDBqCwjI+IeJBhDYsbtcagwIyPiHiQYQtIr0iQFqDAjI+IeJBhCEnMW3AWoMCMj4h4kGEKTsyeUBagwIyPiHiQYQ+MHHkQJqDAjI+IeJBhCoz8S+AoABCIgBsqPJFBKHAQqCATA0YzFiNGE3NWZkOWJhMzdlMGE4NGI5OTE2ZTUxN2U5YzU5MWM1YjllZmFjYWJmMWZlYjFhM2QzNGYzODkyMGEyNTA0NTRkYzlkY2UwZjgxMTk1NmQyMTA4MDRjOTA0OTU5YmU5NmE3NWE5ZDliMTQxMGFhMjVmN2Q5ZTFiNmY2OWMSABKHAQqCATA0YjZhODA2NTRhZGQxMmEyYzFhMTg1MGQwZTQ5MmUyNWVlMjE1MmJmZjNiNWVlOGFmZjUwZmVlYjJhYjA3YmViOWQxMmExNGVlOTc1OWQ1ZDBjY2IyYjU2NTYxMWY2MGZiMTFjZjFhMTk4YTQ2NjdkZjYyZDVkY2Y4MWNhZDMyMTQSABKHAQqCATA0YjI5YTQ3YjQ0N2YyM2JkZWE4OGQ0YzFlZTBiY2QwMmNmNWE3NTcyZWQ1ZmJhNTMwYzJkMmJjMzg4YjhmN2M4ZjVkZWRlYjYyZTE1MmQ1NTg0M2JiOTAxMjAxMzM0MzZjMGNhZmRkNWRhODQyYTBmNDdmMmVlZDIwOTY2ZmQ2N2USABKHAQqCATA0NzQyNjZiMTczZWJjZmZjZTQ5MWE1MjY3ZjhjZDdhZDc4ZTg4ODQzYzc3NjhhZDdkOWNmMTM3ZGJjMWQ3Njg5OTY2ZWI0OWE1MmUwYTcwNDA5OGZjMGRkNmM5NjhkZDE1YzM2YTUzN2Y0ZTU5OGNjYzdiZmY0OTYwZjA2ZWEzYTUSAFCQ26etHhgE", "SystemTransactionCount": "CAI=" }',
        Height: 43143609,
        Time: '2021-08-22T07:27:04.6680186Z',
        ChainId: 'AELF',
        Bloom:
          'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        SignerPubkey:
          '045976a423165178411bf862038eed6db5b16e04aaa28301a61c7ee33e197f3e9a5ed7a975d0d4ec936d81bb812b6129baf26044e93752e8ee508d7cca5a987678',
      },
      Body: {
        TransactionsCount: 2,
        Transactions: [],
      },
      BlockSize: 1467,
    });
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
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    window.fetch = fetch;
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    const result = await httpProvider.sendAsyncByFetch({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 43143609,
      },
    });
    expect(result).toEqual({
      BlockHash:
        'a09208b234f667329fb51e42be085f20f86bfcd9ddd7ce4d98d24bdb3d610bfc',
      Header: {
        PreviousBlockHash:
          '40105e35140c2884148ee4d7dce5d7867850f165c6da44265787b377784e99d8',
        MerkleTreeRootOfTransactions:
          '1c9b53dbd5f42ccceca7c10215867874986e3a75f1d0279fd8f6a152f98e18f8',
        MerkleTreeRootOfWorldState:
          'abf773002dbc0aa29e64064e6773bfe51cf23951adf4cb5bd3eda760a760a409',
        MerkleTreeRootOfTransactionState:
          'c4084bd442913ba4b05f4552f3532755ccd23719fe381d5b97f10775f476f6c8',
        Extra:
          '{ "CrossChain": "", "Consensus": "CkEEWXakIxZReEEb+GIDju1ttbFuBKqigwGmHH7jPhl/Pppe16l10NTsk22Bu4ErYSm68mBE6TdS6O5QjXzKWph2eBK3BwjlgzgSggMKggEwNDU5NzZhNDIzMTY1MTc4NDExYmY4NjIwMzhlZWQ2ZGI1YjE2ZTA0YWFhMjgzMDFhNjFjN2VlMzNlMTk3ZjNlOWE1ZWQ3YTk3NWQwZDRlYzkzNmQ4MWJiODEyYjYxMjliYWYyNjA0NGU5Mzc1MmU4ZWU1MDhkN2NjYTVhOTg3Njc4EvoBONyXBkqCATA0NTk3NmE0MjMxNjUxNzg0MTFiZjg2MjAzOGVlZDZkYjViMTZlMDRhYWEyODMwMWE2MWM3ZWUzM2UxOTdmM2U5YTVlZDdhOTc1ZDBkNGVjOTM2ZDgxYmI4MTJiNjEyOWJhZjI2MDQ0ZTkzNzUyZThlZTUwOGQ3Y2NhNWE5ODc2NzhqBgjI+IeJBmoLCMj4h4kGEOi0kDBqCwjI+IeJBhDYsbtcagwIyPiHiQYQtIr0iQFqDAjI+IeJBhCEnMW3AWoMCMj4h4kGEKTsyeUBagwIyPiHiQYQ+MHHkQJqDAjI+IeJBhCoz8S+AoABCIgBsqPJFBKHAQqCATA0YzFiNGE3NWZkOWJhMzdlMGE4NGI5OTE2ZTUxN2U5YzU5MWM1YjllZmFjYWJmMWZlYjFhM2QzNGYzODkyMGEyNTA0NTRkYzlkY2UwZjgxMTk1NmQyMTA4MDRjOTA0OTU5YmU5NmE3NWE5ZDliMTQxMGFhMjVmN2Q5ZTFiNmY2OWMSABKHAQqCATA0YjZhODA2NTRhZGQxMmEyYzFhMTg1MGQwZTQ5MmUyNWVlMjE1MmJmZjNiNWVlOGFmZjUwZmVlYjJhYjA3YmViOWQxMmExNGVlOTc1OWQ1ZDBjY2IyYjU2NTYxMWY2MGZiMTFjZjFhMTk4YTQ2NjdkZjYyZDVkY2Y4MWNhZDMyMTQSABKHAQqCATA0YjI5YTQ3YjQ0N2YyM2JkZWE4OGQ0YzFlZTBiY2QwMmNmNWE3NTcyZWQ1ZmJhNTMwYzJkMmJjMzg4YjhmN2M4ZjVkZWRlYjYyZTE1MmQ1NTg0M2JiOTAxMjAxMzM0MzZjMGNhZmRkNWRhODQyYTBmNDdmMmVlZDIwOTY2ZmQ2N2USABKHAQqCATA0NzQyNjZiMTczZWJjZmZjZTQ5MWE1MjY3ZjhjZDdhZDc4ZTg4ODQzYzc3NjhhZDdkOWNmMTM3ZGJjMWQ3Njg5OTY2ZWI0OWE1MmUwYTcwNDA5OGZjMGRkNmM5NjhkZDE1YzM2YTUzN2Y0ZTU5OGNjYzdiZmY0OTYwZjA2ZWEzYTUSAFCQ26etHhgE", "SystemTransactionCount": "CAI=" }',
        Height: 43143609,
        Time: '2021-08-22T07:27:04.6680186Z',
        ChainId: 'AELF',
        Bloom:
          'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        SignerPubkey:
          '045976a423165178411bf862038eed6db5b16e04aaa28301a61c7ee33e197f3e9a5ed7a975d0d4ec936d81bb812b6129baf26044e93752e8ee508d7cca5a987678',
      },
      Body: {
        TransactionsCount: 2,
        Transactions: [],
      },
      BlockSize: 1467,
    });
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
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'blockChain/blockHeight',
        method: 'GET',
      })
    ).rejects.toEqual({
      type: 'timeout',
    });
    global.AbortController = abortController;
  });
  test('test send async by fetch when error', async () => {
    const xhr = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    window.fetch = fetch;
    const NewHttpProvider = require('../../../src/util/httpProvider').default;
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
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
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'blockChain/blockHeight',
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
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'blockChain/blockHeight',
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
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'blockChain/blockHeight',
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
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'blockChain/blockHeight',
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
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    window.fetch = originFetch;
    await expect(
      httpProvider.sendAsyncByFetch({
        url: 'blockChain/blockHeight',
        method: 'GET',
      })
    ).rejects.toEqual('failed when result is not ok');
  });
  test('test get request send by xhr', () => {
    const httpProvider = new HttpProvider(stageEndpoint);
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
    const httpProvider = new HttpProvider(stageEndpoint);
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
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
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

  test('test send by xhr', async () => {
    const httpProvider = new HttpProvider(stageEndpoint);
    const result = httpProvider.send({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 136240697,
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
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    try {
      httpProvider.send({
        url: 'blockChain/blockByHeight',
        method: 'GET',
        params: {
          blockHeight: 136240697,
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
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    const result = await httpProvider.sendAsync({
      url: 'blockChain/blockByHeight',
      method: 'GET',
      params: {
        blockHeight: 136240697,
      },
    });
    expect(result).toEqual({
      BlockHash:
        'f8bd119ae0a2a93913ad5104143cae05f71c9f4674b44462cfb39acf6e42f76d',
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
    });
  });
  test('test send async by xhr method', async () => {
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
  test('test send async by xhr', async () => {
    const httpProvider = new HttpProvider(stageEndpoint);
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
    // use stageEndPoint may cause:
    // Cross origin http://localhost forbidden
    const httpProvider = new HttpProvider(
      'https://explorer-test.aelf.io/chain'
    );
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
    const httpProvider = new HttpProvider(stageEndpoint);
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
    const httpProvider = new NewHttpProvider(stageEndpoint);
    window.XMLHttpRequest = xhr;
    const result = await httpProvider.isConnectedAsync();
    expect(!!result).toBeTruthy();
  });
  test('test is not connected when async', async () => {
    const httpProvider = new HttpProvider(stageEndpoint);
    const result = await httpProvider.isConnectedAsync();
    expect(result).toBeFalsy();
  });
});
