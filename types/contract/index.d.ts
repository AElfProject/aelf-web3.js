import Chain from '../chain';
import { IFileDescriptorSet } from '@aelfqueen/protobufjs/ext/descriptor';
import * as protobuf from '@aelfqueen/protobufjs/light';
import { IWallet } from '../wallet';
import { GenericFunction } from '../util/utils';
export class Contract {
  constructor(chain: Chain, services: Array<protobuf.Service>, address: string);
}
declare class ContractFactory {
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
