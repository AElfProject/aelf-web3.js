import Chain from '../chain';
import { IFileDescriptorSet } from '@aelfqueen/protobufjs/ext/descriptor';
import * as protobuf from '@aelfqueen/protobufjs/light';
import { IWalletInfo } from '../wallet';
import { TGenericFunction } from '../util/utils';
import { TAddress } from '../util/proto';
export class Contract {
  constructor(
    chain: Chain,
    services: Array<protobuf.Service>,
    address: TAddress
  );
}

interface IContractFactory {
  // just describe the public side of the class
  at(address: TAddress, callback: TGenericFunction): Contract;
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

  public at(address: TAddress, callback: TGenericFunction): Contract;
}

export default ContractFactory;
