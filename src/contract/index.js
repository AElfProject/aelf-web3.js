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

class Contract {
  constructor(chain, services, address) {
    this._chain = chain;
    this.address = address;
    this.services = services;
  }

  deserializeLog(logs = [], logName) {
    const logInThisAddress = logs.filter(v => v.Address === this.address && v.Name === logName);
    return deserializeLog(logInThisAddress, this.services);
  }
}

export default class ContractFactory {
  constructor(chain, fileDescriptorSet, wallet, options) {
    this.chain = chain;
    this.services = getServicesFromFileDescriptors(fileDescriptorSet);
    this.wallet = wallet;
    this._options = options;
  }

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

  at(address, callback = noop) {
    const contractInstance = new Contract(this.chain, this.services, address);
    ContractFactory.bindMethodsToContract(contractInstance, this.wallet, this._options);
    callback(null, contractInstance);
    return contractInstance;
  }
}
