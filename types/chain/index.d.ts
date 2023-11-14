import { Contract } from 'types/contract';
import { RequestManager } from 'types/util/requestManage';
import { IWalletInfo } from '../wallet';
import { IExtractArgumentsIntoObjectResult, TExtractArg } from './chainMethod';
import {
  TAddress,
  TBlockHash,
  TBlockHeight,
  TChainId,
  TTransactionId,
} from '../util/proto';
export interface IError {
  Error: {
    Code: string | null;
    Message: string;
    Details: string | null;
    Data: {
      [key in string]: string;
    };
    ValidationErrors:
      | [
          {
            Message: string;
            Members: string[];
          }
        ]
      | null;
  };
}
export interface IChainStatus {
  ChainId: TChainId;
  Branches: {
    [key in string]: number;
  };
  NotLinkedBlocks: {
    [key in string]: number;
  };
  LongestChainHeight: TBlockHeight;
  LongestChainHash: TBlockHash;
  GenesisBlockHash: TBlockHash;
  GenesisContractAddress: TAddress;
  LastIrreversibleBlockHash: TBlockHash;
  LastIrreversibleBlockHeight: TBlockHeight;
  BestChainHash: TBlockHash;
  BestChainHeight: TBlockHeight;
}

export interface IChainState {
  BlockHash: TBlockHash;
  PreviousHash: TBlockHash;
  BlockHeight: TBlockHeight;
  Changes: {
    [key in string]: string;
  };
  Deletes: [string];
}

export interface IBlock {
  BlockHash: TBlockHash;
  Header: {
    PreviousBlockHash: TBlockHash;
    MerkleTreeRootOfTransactions: string;
    MerkleTreeRootOfWorldState: string;
    MerkleTreeRootOfTransactionState: string;
    Extra: string;
    Height: TBlockHeight;
    Time: string;
    ChainId: TChainId;
    Bloom: string;
    SignerPubkey: string;
  };
  Body: {
    TransactionsCount: number;
    Transactions: string[];
  };
  BlockSize: number;
}

export interface ITransactionResult {
  TransactionId: TTransactionId;
  Status: string;
  Logs: {
    Address: TAddress;
    Name: string;
    Indexed: string[];
    NonIndexed: string;
  }[];
  Bloom: string;
  BlockNumber: TBlockHeight;
  BlockHash: TBlockHash;
  Transaction: {
    From: TAddress;
    To: TAddress;
    RefBlockNumber: TBlockHeight;
    RefBlockPrefix: string;
    MethodName: string;
    Params: string;
    Signature: string;
  };
  ReturnValue: string;
  Error: string;
  TransactionSize: number;
}
export interface IMerklePathByTxId {
  MerklePathNodes: {
    Hash: TBlockHash;
    IsLeftChildNode: boolean;
  }[];
}
export interface ICalculateTransactionFee {
  Success: true;
  TransactionFee: {
    [key in string]: number;
  };
  ResourceFee: {
    [key in string]: number;
  };
}
export interface ITransactionPoolStatus {
  Queued: number;
  Validated: number;
}

export interface IPeer {
  IpAddress: TAddress;
  ProtocolVersion: number;
  ConnectionTime: number;
  ConnectionStatus: string;
  Inbound: true;
  BufferedTransactionsCount: number;
  BufferedBlocksCount: number;
  BufferedAnnouncementsCount: number;
  RequestMetrics: {
    RoundTripTime: number;
    MethodName: string;
    Info: string;
    RequestTime: {
      Seconds: number;
      Nanos: number;
    };
  }[];
  NodeVersion: string;
}

declare class Chain {
  constructor(requestManager: RequestManager);
  public extractArgumentsIntoObject(
    args: TExtractArg[]
  ): IExtractArgumentsIntoObjectResult;
  public contractAt(
    address: TAddress,
    wallet: IWalletInfo,
    args: { [k in string]: any }
  ): Contract | Promise<Contract>;
  public getMerklePath(
    txId: string,
    height: TBlockHeight,
    ...args: { [k in string]: any }[]
  ): any[] | null | Promise<any[] | null>;
  getChainStatus(): Promise<IChainStatus & IError>;
  getChainState(blockHash: string): Promise<IChainState & IError>;
  getContractFileDescriptorSet(address: string): Promise<string & IError>;
  getBlockHeight(): TBlockHeight;
  getBlock(
    blockHash: TBlockHash,
    includeTransactions: boolean
  ): Promise<IBlock & IError>;
  getBlockByHeight(
    blockHeight: TBlockHeight,
    includeTransactions?: boolean
  ): Promise<IBlock & IError>;
  getTxResult(
    transactionId: TTransactionId
  ): Promise<ITransactionResult & IError>;
  getTxResults(
    blockHash: TBlockHash,
    offset: number,
    limit: number
  ): Promise<ITransactionResult[] & IError>;
  getMerklePathByTxId(
    transactionId: TTransactionId
  ): Promise<IMerklePathByTxId & IError>;
  getTransactionPoolStatus(): Promise<ITransactionPoolStatus & IError>;
  sendTransaction(
    RawTransaction: TRawTransaction
  ): Promise<{ TransactionId: TTransactionId } & IError>;
  sendTransactions(RawTransaction: string): Promise<string[] & IError>;
  calculateTransactionFee(
    RawTransaction: TRawTransaction
  ): Promise<ICalculateTransactionFee & IError>;
  callReadOnly(RawTransaction: TRawTransaction): Promise<string & IError>;
  getPeers(withMetrics?: boolean): Promise<IPeer[] & IError>;
  addPeer(Address: TAddress): Promise<true & IError>;
  removePeer(address: TAddress): Promise<true & IError>;
  networkInfo(): Promise<
    {
      Version: string;
      ProtocolVersion: number;
      Connections: number;
    } & IError
  >;
}
export default Chain;
