import { Contract } from 'types/contract';
import { RequestManager } from 'types/util/requestManage';
import { IWalletInfo } from '../wallet';
import { ExtractArgumentsIntoObjectResult, ExtractArg } from './chainMethod';
import { TAddress, TBlockHash, TBlockHeight, TChainId, TTransactionId, TRawTransaction } from '../util/proto';
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

export interface ChainState {
  BlockHash: TBlockHash;
  PreviousHash: TBlockHash;
  BlockHeight: TBlockHeight;
  Changes: {
    [key in string]: string;
  };
  Deletes: [string];
}

export interface Block {
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

export interface TransactionResult {
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
export interface MerklePathByTxId {
  MerklePathNodes: {
    Hash: TBlockHash;
    IsLeftChildNode: boolean;
  }[];
}
export interface CalculateTransactionFee {
  Success: true;
  TransactionFee: {
    [key in string]: number;
  };
  ResourceFee: {
    [key in string]: number;
  };
}
export interface TransactionPoolStatus {
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

interface IChain {
  extractArgumentsIntoObject(args: ExtractArg[]): ExtractArgumentsIntoObjectResult;
  contractAt(address: TAddress, wallet: IWalletInfo, args: { [k in string]: any }): Contract | Promise<Contract>;
  getMerklePath(
    txId: string,
    height: TBlockHeight,
    ...args: { [k in string]: any }[]
  ): any[] | null | Promise<any[] | null>;
  getChainStatus(): Promise<IChainStatus & IError>;
  getChainState(blockHash: string): Promise<ChainState & IError>;
  getContractFileDescriptorSet(address: string): Promise<string & IError>;
  getBlockHeight(): TBlockHeight;
  getBlock(blockHash: TBlockHash, includeTransactions: boolean): Promise<Block & IError>;
  getBlockByHeight(blockHeight: TBlockHeight, includeTransactions?: boolean): Promise<Block & IError>;
  getContractViewMethodList(): Promise<string[] & IError>;
  getTxResult(transactionId: TTransactionId): Promise<TransactionResult & IError>;
  getTxResults(blockHash: TBlockHash, offset: number, limit: number): Promise<TransactionResult[] & IError>;
  getMerklePathByTxId(transactionId: TTransactionId): Promise<MerklePathByTxId & IError>;
  getTransactionPoolStatus(): Promise<TransactionPoolStatus & IError>;
  sendTransaction(RawTransaction: TRawTransaction): Promise<{ TransactionId: TTransactionId } & IError>;
  sendTransactions(RawTransaction: string): Promise<string[] & IError>;
  calculateTransactionFee(RawTransaction: TRawTransaction): Promise<CalculateTransactionFee & IError>;
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

declare class Chain implements IChain {
  constructor(requestManager: RequestManager);
  public extractArgumentsIntoObject(args: ExtractArg[]): ExtractArgumentsIntoObjectResult;
  public contractAt(address: TAddress, wallet: IWalletInfo, args: { [k in string]: any }): Contract | Promise<Contract>;
  public getMerklePath(
    txId: string,
    height: TBlockHeight,
    ...args: { [k in string]: any }[]
  ): any[] | null | Promise<any[] | null>;
  getChainStatus(): Promise<IChainStatus & IError>;
  getChainState(blockHash: string): Promise<ChainState & IError>;
  getContractFileDescriptorSet(address: string): Promise<string & IError>;
  getBlockHeight(): TBlockHeight;
  getBlock(blockHash: TBlockHash, includeTransactions: boolean): Promise<Block & IError>;
  getBlockByHeight(blockHeight: TBlockHeight, includeTransactions?: boolean): Promise<Block & IError>;
  getContractViewMethodList(): Promise<string[] & IError>;
  getTxResult(transactionId: TTransactionId): Promise<TransactionResult & IError>;
  getTxResults(blockHash: TBlockHash, offset: number, limit: number): Promise<TransactionResult[] & IError>;
  getMerklePathByTxId(transactionId: TTransactionId): Promise<MerklePathByTxId & IError>;
  getTransactionPoolStatus(): Promise<TransactionPoolStatus & IError>;
  sendTransaction(RawTransaction: TRawTransaction): Promise<{ TransactionId: TTransactionId } & IError>;
  sendTransactions(RawTransaction: string): Promise<string[] & IError>;
  calculateTransactionFee(RawTransaction: TRawTransaction): Promise<CalculateTransactionFee & IError>;
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
