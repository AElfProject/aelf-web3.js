import Chain from "types/chain";
import { IFileDescriptorSet } from "@aelfqueen/protobufjs/ext/descriptor";
import * as protobuf from "@aelfqueen/protobufjs/light";
import { IWallet } from "types/wallet";
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

  public at(address: string, callback: Function): Contract;
}

export default ContractFactory;
