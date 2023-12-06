import Chain from '../chain';
import { IFileDescriptorSet } from '@aelfqueen/protobufjs/ext/descriptor';
import * as protobuf from '@aelfqueen/protobufjs/light';
import { WalletInfo } from '../wallet';
import { GenericFunction } from '../util/utils';
import { Address } from '../util/proto';
export class Contract {
  constructor(
    chain: Chain,
    services: Array<protobuf.Service>,
    address: Address
  );
}

interface IContractFactory {
  // just describe the public side of the class
  at(address: Address, callback: GenericFunction): Contract;
}
declare class ContractFactory implements IContractFactory {
  constructor(
    chain: Chain,
    fileDescriptorSet: IFileDescriptorSet,
    wallet: WalletInfo
  );
  public static bindMethodsToContract(
    contract: Contract,
    wallet: WalletInfo
  ): void;

  public at(address: Address, callback: GenericFunction): Contract;
}

export default ContractFactory;
