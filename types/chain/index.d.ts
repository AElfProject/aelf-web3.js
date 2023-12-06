import { Contract } from 'types/contract';
import { RequestManager } from 'types/util/requestManage';
import { WalletInfo } from '../wallet';
import { ExtractArgumentsIntoObjectResult, ExtractArg } from './chainMethod';
import {
  Address,
  BlockHash,
  BlockHeight,
  ChainId,
  TransactionId,
  RawTransaction,
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
export interface ChainStatus {
  ChainId: ChainId;
  Branches: {
    [key in string]: number;
  };
  NotLinkedBlocks: {
    [key in string]: number;
  };
  LongestChainHeight: BlockHeight;
  LongestChainHash: BlockHash;
  GenesisBlockHash: BlockHash;
  GenesisContractAddress: Address;
  LastIrreversibleBlockHash: BlockHash;
  LastIrreversibleBlockHeight: BlockHeight;
  BestChainHash: BlockHash;
  BestChainHeight: BlockHeight;
}

export interface ChainState {
  BlockHash: BlockHash;
  PreviousHash: BlockHash;
  BlockHeight: BlockHeight;
  Changes: {
    [key in string]: string;
  };
  Deletes: [string];
}

export interface Block {
  BlockHash: BlockHash;
  Header: {
    PreviousBlockHash: BlockHash;
    MerkleTreeRootOfTransactions: string;
    MerkleTreeRootOfWorldState: string;
    MerkleTreeRootOfTransactionState: string;
    Extra: string;
    Height: BlockHeight;
    Time: string;
    ChainId: ChainId;
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
  TransactionId: TransactionId;
  Status: string;
  Logs: {
    Address: Address;
    Name: string;
    Indexed: string[];
    NonIndexed: string;
  }[];
  Bloom: string;
  BlockNumber: BlockHeight;
  BlockHash: BlockHash;
  Transaction: {
    From: Address;
    To: Address;
    RefBlockNumber: BlockHeight;
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
    Hash: BlockHash;
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
  IpAddress: Address;
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
  extractArgumentsIntoObject(
    args: ExtractArg[]
  ): ExtractArgumentsIntoObjectResult;
  contractAt(
    address: Address,
    wallet: WalletInfo,
    args: { [k in string]: any }
  ): Contract | Promise<Contract>;
  getMerklePath(
    txId: string,
    height: BlockHeight,
    ...args: { [k in string]: any }[]
  ): any[] | null | Promise<any[] | null>;
  getChainStatus(): Promise<ChainStatus & IError>;
  getChainState(blockHash: string): Promise<ChainState & IError>;
  getContractFileDescriptorSet(address: string): Promise<string & IError>;
  getBlockHeight(): BlockHeight;
  getBlock(
    blockHash: BlockHash,
    includeTransactions: boolean
  ): Promise<Block & IError>;
  getBlockByHeight(
    blockHeight: BlockHeight,
    includeTransactions?: boolean
  ): Promise<Block & IError>;
  getTxResult(
    transactionId: TransactionId
  ): Promise<TransactionResult & IError>;
  getTxResults(
    blockHash: BlockHash,
    offset: number,
    limit: number
  ): Promise<TransactionResult[] & IError>;
  getMerklePathByTxId(
    transactionId: TransactionId
  ): Promise<MerklePathByTxId & IError>;
  getTransactionPoolStatus(): Promise<TransactionPoolStatus & IError>;
  sendTransaction(
    RawTransaction: RawTransaction
  ): Promise<{ TransactionId: TransactionId } & IError>;
  sendTransactions(RawTransaction: string): Promise<string[] & IError>;
  calculateTransactionFee(
    RawTransaction: RawTransaction
  ): Promise<CalculateTransactionFee & IError>;
  callReadOnly(RawTransaction: RawTransaction): Promise<string & IError>;
  getPeers(withMetrics?: boolean): Promise<IPeer[] & IError>;
  addPeer(Address: Address): Promise<true & IError>;
  removePeer(address: Address): Promise<true & IError>;
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
  public extractArgumentsIntoObject(
    args: ExtractArg[]
  ): ExtractArgumentsIntoObjectResult;
  public contractAt(
    address: Address,
    wallet: WalletInfo,
    args: { [k in string]: any }
  ): Contract | Promise<Contract>;
  public getMerklePath(
    txId: string,
    height: BlockHeight,
    ...args: { [k in string]: any }[]
  ): any[] | null | Promise<any[] | null>;
  getChainStatus(): Promise<ChainStatus & IError>;
  getChainState(blockHash: string): Promise<ChainState & IError>;
  getContractFileDescriptorSet(address: string): Promise<string & IError>;
  getBlockHeight(): BlockHeight;
  getBlock(
    blockHash: BlockHash,
    includeTransactions: boolean
  ): Promise<Block & IError>;
  getBlockByHeight(
    blockHeight: BlockHeight,
    includeTransactions?: boolean
  ): Promise<Block & IError>;
  getTxResult(
    transactionId: TransactionId
  ): Promise<TransactionResult & IError>;
  getTxResults(
    blockHash: BlockHash,
    offset: number,
    limit: number
  ): Promise<TransactionResult[] & IError>;
  getMerklePathByTxId(
    transactionId: TransactionId
  ): Promise<MerklePathByTxId & IError>;
  getTransactionPoolStatus(): Promise<TransactionPoolStatus & IError>;
  sendTransaction(
    RawTransaction: RawTransaction
  ): Promise<{ TransactionId: TransactionId } & IError>;
  sendTransactions(RawTransaction: string): Promise<string[] & IError>;
  calculateTransactionFee(
    RawTransaction: RawTransaction
  ): Promise<CalculateTransactionFee & IError>;
  callReadOnly(RawTransaction: RawTransaction): Promise<string & IError>;
  getPeers(withMetrics?: boolean): Promise<IPeer[] & IError>;
  addPeer(Address: Address): Promise<true & IError>;
  removePeer(address: Address): Promise<true & IError>;
  networkInfo(): Promise<
    {
      Version: string;
      ProtocolVersion: number;
      Connections: number;
    } & IError
  >;
}
export default Chain;
