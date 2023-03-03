const gbk = require('gbk-string');
import ChainMethod from '../../../src/chain/chainMethod';
import {
  inputAddressFormatter,
  outputFileDescriptorSetFormatter,
} from '../../../src/util/formatters';
import HttpProvider from '../../../src/util/httpProvider';
import RequestManager from '../../../src/util/requestManage';
const stageEndpoint = 'https://aelf-public-node.aelf.io';
describe('chainMethod should work', () => {
  test('test format input params with no inputFormatter', () => {
    const chainMethod = new ChainMethod({
      name: 'addPeer',
      call: 'net/peer',
      method: 'POST',
      params: ['address'],
      inputFormatter: [],
    });
    const address =
      'ELF_ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx_tDVW';
    const result = chainMethod.formatInput(address);
    expect(result).toEqual(address);
  });
  test('test format input params with inputFormatter', () => {
    const chainMethod = new ChainMethod({
      name: 'getContractFileDescriptorSet',
      call: 'blockChain/contractFileDescriptorSet',
      method: 'GET',
      params: ['address'],
      inputFormatter: [inputAddressFormatter],
      outputFormatter: outputFileDescriptorSetFormatter,
    });
    const address = [
      'ELF_ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx_tDVW',
    ];
    const result = chainMethod.formatInput(address);
    expect(result).toEqual([
      'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    ]);
  });
  test('test manager is on ChainMethod', () => {
    const chainMethod = new ChainMethod({
      name: 'addPeer',
      call: 'net/peer',
      method: 'POST',
      params: ['address'],
      inputFormatter: [],
    });
    const manager = new RequestManager();
    chainMethod.setRequestManager(manager);
    expect(chainMethod.requestManager).toEqual(manager);
  });
  test('test format input params with no outputFormatter', () => {
    const chainMethod = new ChainMethod({
      name: 'addPeer',
      call: 'net/peer',
      method: 'POST',
      params: ['address'],
      inputFormatter: [],
    });
    const address =
      'ELF_ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx_tDVW';
    const result = chainMethod.formatOutput(address);
    expect(result).toEqual(address);
  });
  test('test format input params with outputFormatter', () => {
    const chainMethod = new ChainMethod({
      name: 'getContractFileDescriptorSet',
      call: 'blockChain/contractFileDescriptorSet',
      method: 'GET',
      params: ['address'],
      inputFormatter: [inputAddressFormatter],
      outputFormatter: outputFileDescriptorSetFormatter,
    });
    const address = 'CiIKIB7Dg+4T7eLv5hCby8b4g2IL6nkg/EerfNaAfWgby3SR';
    const name = chainMethod.formatOutput(address).file[0].name;
    const str = gbk.encodeGBK(name);
    expect(str).toBe(
      '%1E%3F%3F%13%3F%3F%3F%3F%10%3F%3F%3F%3F%3Fb%B%3Fy%20%3FG%3F%7C%3F%7Dh%1B%3Ft%3F'
    );
  });
  test('test not enough parameters', () => {
    const chainMethod = new ChainMethod({
      name: 'getContractFileDescriptorSet',
      call: 'blockChain/contractFileDescriptorSet',
      method: 'GET',
      params: ['address'],
      inputFormatter: [inputAddressFormatter],
      outputFormatter: outputFileDescriptorSetFormatter,
    });
    expect(() => chainMethod.extractArgumentsIntoObject([])).toThrow(
      'should supply enough parameters for blockChain/contractFileDescriptorSet'
    );
  });
  test('test fn argument into object', () => {
    const chainMethod = new ChainMethod({
      name: 'getContractFileDescriptorSet',
      call: 'blockChain/contractFileDescriptorSet',
      method: 'GET',
      params: ['address'],
      inputFormatter: [inputAddressFormatter],
      outputFormatter: outputFileDescriptorSetFormatter,
    });
    const address =
      'ELF_ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx_tDVW';
    const fn = new Function();
    const args = [address, fn];
    const result = chainMethod.extractArgumentsIntoObject(args);
    expect(result.callback).toEqual(fn);
  });
  test('test sync argument into object', () => {
    const chainMethod = new ChainMethod({
      name: 'getContractFileDescriptorSet',
      call: 'blockChain/contractFileDescriptorSet',
      method: 'GET',
      params: ['address'],
      inputFormatter: [inputAddressFormatter],
      outputFormatter: outputFileDescriptorSetFormatter,
    });
    const address =
      'ELF_ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx_tDVW';
    const args = [address, { sync: true }];
    const result = chainMethod.extractArgumentsIntoObject(args);
    expect(result.isSync).toBeTruthy();
  });
  test('test index is less than or equal to params.length', () => {
    const chainMethod = new ChainMethod({
      name: 'getMerklePathByTxId',
      call: 'blockChain/merklePathByTransactionId',
      method: 'GET',
      params: ['transactionId'],
    });
    const transactionId =
      '4c12bd187803fa1b63ac5794f614496154454725aa6c6747c890cdab39708e02';
    const result = chainMethod.extractArgumentsIntoObject([transactionId]);
    expect(result.params).toEqual({
      transactionId:
        '4c12bd187803fa1b63ac5794f614496154454725aa6c6747c890cdab39708e02',
    });
  });
  test('test sync argument', () => {
    const chainMethod = new ChainMethod({
      name: 'getChainStatus',
      call: 'blockChain/chainStatus',
      method: 'GET',
      params: [],
    });
    const httpProvider = new HttpProvider('https://aelf-public-node.aelf.io');
    const manager = new RequestManager(httpProvider);
    chainMethod.setRequestManager(manager);
    const result = chainMethod.run({ sync: true });
    expect(result.ChainId).toEqual('AELF');
  });
  test('test fn argument when async', async () => {
    const chainMethod = new ChainMethod({
      name: 'getChainStatus',
      call: 'blockChain/chainStatus',
      method: 'GET',
      params: [],
    });
    const httpProvider = new HttpProvider('https://aelf-public-node.aelf.io');
    const manager = new RequestManager(httpProvider);
    chainMethod.setRequestManager(manager);
    const fn = jest.fn();
    const result = await chainMethod.run(fn);
    console.log(result);
    expect(result.ChainId).toEqual('AELF');
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith(null, result);
  });
});
