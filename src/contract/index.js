/**
 * @file contract
 * @author atom-yang
 */
// eslint-disable-next-line max-classes-per-file
import * as protobuf from '@aelfqueen/protobufjs/light';
import {
  transform,
  transformArrayToMap,
  OUTPUT_TRANSFORMERS
} from '../util/transform';
import ContractMethod from './contractMethod';
import { noop } from '../util/utils';

const getServicesFromFileDescriptors = descriptors => {
  const root = protobuf.Root.fromDescriptor(descriptors, 'proto3').resolveAll();
  return descriptors.file.filter(f => f.service.length > 0).map(f => {
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
    const logInThisAddress = (logs || []).filter(v => v.Address === this.address && logName === v.Name);
    if (logInThisAddress.length === 0) {
      return [];
    }
    return logInThisAddress.map(item => {
      const {
        Name,
        NonIndexed,
        Indexed
      } = item;
      let dataType;
      // eslint-disable-next-line no-restricted-syntax
      for (const service of this.services) {
        try {
          dataType = service.lookupType(Name);
          break;
        } catch (e) {}
      }
      const serializedData = [...(Indexed || [])];
      if (NonIndexed) {
        serializedData.push(NonIndexed);
      }
      let result = serializedData.reduce((acc, v) => {
        let deserialize = dataType.decode(Buffer.from(v, 'base64'));
        deserialize = dataType.toObject(deserialize, {
          enums: String, // enums as string names
          longs: String, // longs as strings (requires long.js)
          bytes: String, // bytes as base64 encoded strings
          defaults: false, // includes default values
          arrays: true, // populates empty arrays (repeated fields) even if defaults=false
          objects: true, // populates empty objects (map fields) even if defaults=false
          oneofs: true // includes virtual oneof fields set to the present field's name
        });
        return {
          ...acc,
          ...deserialize
        };
      }, {});
      result = transform(dataType, result, OUTPUT_TRANSFORMERS);
      result = transformArrayToMap(dataType, result);
      return result;
    });
  }
}

export default class ContractFactory {
  constructor(chain, fileDescriptorSet, wallet) {
    this.chain = chain;
    this.services = getServicesFromFileDescriptors(fileDescriptorSet);
    this.wallet = wallet;
  }

  static bindMethodsToContract(contract, wallet) {
    contract.services.forEach(service => {
      Object.keys(service.methods).forEach(key => {
        const method = service.methods[key].resolve();
        const contractMethod = new ContractMethod(contract._chain, method, contract.address, wallet);
        contractMethod.bindMethodToContract(contract);
      });
    });
  }

  at(address, callback = noop) {
    const contractInstance = new Contract(this.chain, this.services, address);
    ContractFactory.bindMethodsToContract(contractInstance, this.wallet);
    callback(null, contractInstance);
    return contractInstance;
  }
}
