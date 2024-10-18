/**
 * @file contract
 * @author atom-yang
 */
// eslint-disable-next-line max-classes-per-file
import * as protobuf from '@aelfqueen/protobufjs';
import ContractMethod from './contractMethod';
import { noop } from '../util/utils';
import { deserializeLog } from '../util/proto';
import ContractMultiTransaction from './contractMultiTransaction';

const getServicesFromFileDescriptors = descriptors => {
  const root = protobuf.Root.fromDescriptor(descriptors, 'proto3').resolveAll();
  return descriptors.file
    .filter(f => f.service.length > 0)
    .map(f => {
      const sn = f.service[0].name;
      const fullName = f.package ? `${f.package}.${sn}` : sn;
      return root.lookupService(fullName);
    });
};
/**
 * @typedef {import('../../types/chain').default} Chain
 * @typedef {import('../../types/util/proto').TAddress} TAddress
 * @typedef {import('../../types/util/utils').TGenericFunction} TGenericFunction
 * @typedef {import('@aelfqueen/protobufjs/ext/descriptor').IFileDescriptorSet} IFileDescriptorSet
 * @typedef {import('../../types/wallet').IWalletInfo} IWalletInfo
 * @typedef {import('@aelfqueen/protobufjs')} protobuf
 */
class Contract {
  /**
   * Creates an instance of Contract.
   *
   * @param {Chain} chain - The chain instance.
   * @param {Array<protobuf.Service>} services - The array of services available in the contract.
   * @param {TAddress} address - The address of the contract.
   */
  constructor(chain, services, address) {
    this._chain = chain;
    this.address = address;
    this.services = services;
  }
  /**
   * Deserializes logs for the specified log name.
   *
   * @param {Array} [logs=[]] - The array of logs to filter. Defaults to an empty array.
   * @param {string} logName - The name of the log to deserialize.
   * @returns {Array} - The deserialized logs for the specified log name.
   */

  deserializeLog(logs = [], logName) {
    const logInThisAddress = logs.filter(v => v.Address === this.address && v.Name === logName);
    return deserializeLog(logInThisAddress, this.services);
  }
}

export default class ContractFactory {
  /**
   * Creates an instance of ContractFactory.
   *
   * @param {Chain} chain - The chain instance.
   * @param {IFileDescriptorSet} fileDescriptorSet - The file descriptor set containing service definitions.
   * @param {IWalletInfo} wallet - The wallet instance for managing transactions.
   * @param {Object} options - Additional options for the contract factory.
   */
  constructor(chain, fileDescriptorSet, wallet, options) {
    this.chain = chain;
    this.services = getServicesFromFileDescriptors(fileDescriptorSet);
    this.wallet = wallet;
    this._options = options;
  }
  /**
   * Binds methods to the contract instance.
   *
   * @param {Contract} contract - The contract instance to bind methods to.
   * @param {IWalletInfo} wallet - The wallet instance.
   * @param {Object.<string, any>} options - Additional options for binding.
   */

  static bindMethodsToContract(contract, wallet, options) {
    contract.services.forEach(service => {
      Object.keys(service.methods).forEach(key => {
        const method = service.methods[key].resolve();
        const contractMethod = new ContractMethod(contract._chain, method, contract.address, wallet, options);
        contractMethod.bindMethodToContract(contract);
      });
    });
    const contractMultiTransaction = new ContractMultiTransaction(contract, wallet, options);
    // eslint-disable-next-line no-param-reassign
    contract.sendMultiTransactionToGateway = contractMultiTransaction.sendMultiTransactionToGateway;
  }
  /**
   * Creates a new contract instance at the specified address.
   *
   * @param {TAddress} address - The address of the contract.
   * @param {TGenericFunction} callback - The callback to invoke with the contract instance.
   * @returns {Contract} - The created contract instance.
   */

  at(address, callback = noop) {
    const contractInstance = new Contract(this.chain, this.services, address);
    ContractFactory.bindMethodsToContract(contractInstance, this.wallet, this._options);
    callback(null, contractInstance);
    return contractInstance;
  }
}
