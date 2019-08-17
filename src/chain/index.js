/**
 * @file chain
 * @author atom-yang
 */
import {
  isBoolean,
  isFunction,
  noop,
  setPath
} from '../util/utils';
import { CHAIN_METHODS } from '../common/constants';
import ChainMethod from './chainMethod';
import * as merkleTree from '../util/merkleTree';

import ContractFactory from '../contract';

export default class Chain {
  constructor(requestManager) {
    Object.keys(CHAIN_METHODS).forEach(key => {
      const methodConfig = CHAIN_METHODS[key];
      const { name } = methodConfig;
      const method = new ChainMethod(methodConfig);
      method.setRequestManager(requestManager);
      setPath(this, name, method.run);
    });
  }

  extractArgumentsIntoObject(args) {
    const result = {
      callback: noop,
      isSync: false
    };
    if (args.length === 0) {
      // has no callback, default to be async mode
      return result;
    }
    if (isFunction(args[args.length - 1])) {
      result.callback = args[args.length - 1];
    }
    args.forEach(arg => {
      if (isBoolean((arg.sync))) {
        result.isSync = arg.sync;
      }
    });
    return result;
  }

  contractAt(address, wallet, ...args) {
    const { callback, isSync } = this.extractArgumentsIntoObject(args);
    if (isSync) {
      const fds = this.getContractFileDescriptorSet(address, {
        sync: true
      });
      if (fds && fds.file && fds.file.length > 0) {
        const factory = new ContractFactory(this, fds, wallet);
        return factory.at(address);
      }
      throw new Error('no such contract');
    }
    // eslint-disable-next-line consistent-return
    return this.getContractFileDescriptorSet(address).then(fds => {
      if (fds && fds.file && fds.file.length > 0) {
        const factory = new ContractFactory(this, fds, wallet);
        const result = factory.at(address);
        callback(null, result);
        return result;
      }
      callback(new Error('no such contract'));
      if (callback.length > 0) {
        throw new Error('no such contract');
      }
    });
  }

  getMerklePath(txId, height, ...args) {
    const { isSync } = this.extractArgumentsIntoObject(args);
    if (isSync) {
      const block = this.getBlockByHeight(height, true, {
        sync: true
      });
      const { BlockHash, Body } = block;
      const txIds = Body.Transactions;
      const txIndex = txIds.findIndex(id => id === txId);
      if (txIndex === -1) {
        throw new Error(`txId ${txId} has no correspond transaction in the block with height ${height}`);
      }
      const txResults = this.getTxResults(BlockHash, 0, txIds.length, { sync: true });
      const nodes = txResults.map((result, index) => {
        const id = txIds[index];
        const status = result.Status;
        const buffer = Buffer.concat([Buffer.from(id.replace('0x', ''), 'hex'), Buffer.from(status, 'utf8')]);
        return merkleTree.node(buffer);
      });
      return merkleTree.getMerklePath(txIndex, nodes);
    }
    return this.getBlockByHeight(height, true).then(block => {
      const { BlockHash, Body } = block;
      const txIds = Body.Transactions;
      const txIndex = txIds.findIndex(id => id === txId);
      if (txIndex === -1) {
        throw new Error(`txId ${txId} has no correspond transaction in the block with height ${height}`);
      }
      return this.getTxResults(BlockHash, 0, txIds.length).then(results => {
        const nodes = results.map((result, index) => {
          const id = txIds[index];
          const status = result.Status;
          const buffer = Buffer.concat([Buffer.from(id.replace('0x', ''), 'hex'), Buffer.from(status, 'utf8')]);
          return merkleTree.node(buffer);
        });
        return merkleTree.getMerklePath(txIndex, nodes);
      });
    });
  }
}
