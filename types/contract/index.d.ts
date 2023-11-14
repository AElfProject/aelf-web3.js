import Chain from '../chain';
import { IFileDescriptorSet } from '@aelfqueen/protobufjs/ext/descriptor';
import * as protobuf from '@aelfqueen/protobufjs/light';
import { IWalletInfo } from '../wallet';
import { GenericFunction } from '../util/utils';
import { TAddress } from '../util/proto';
export class Contract {
  constructor(chain: Chain, services: Array<protobuf.Service>, address: string);
}

interface IContractFactory {
  // just describe the public side of the class
  at(address: TAddress, callback: GenericFunction): Contract;
}
declare class ContractFactory implements IContractFactory {
  constructor(
    chain: Chain,
    fileDescriptorSet: IFileDescriptorSet,
    wallet: IWalletInfo
  );
  public static bindMethodsToContract(
    contract: Contract,
    wallet: IWalletInfo
  ): void;

  public at(address: TAddress, callback: GenericFunction): Contract;
}

export default ContractFactory;
