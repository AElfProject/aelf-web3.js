import Chain from '../chain';
import { IFileDescriptorSet } from '@aelfqueen/protobufjs/ext/descriptor';
import * as protobuf from '@aelfqueen/protobufjs/light';
import { IWallet } from '../wallet';
import { GenericFunction } from '../util/utils';
export class Contract {
  constructor(chain: Chain, services: Array<protobuf.Service>, address: string);
}

interface IContractFactory {
  // just describe the public side of the class
  at(address: string, callback: GenericFunction): Contract;
}
declare class ContractFactory implements IContractFactory {
  constructor(
    chain: Chain,
    fileDescriptorSet: IFileDescriptorSet,
    wallet: IWallet
  );
  public static bindMethodsToContract(
    contract: Contract,
    wallet: IWallet
  ): void;

  public at(address: string, callback: GenericFunction): Contract;
}

export default ContractFactory;
