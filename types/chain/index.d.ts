import { Contract } from 'types/contract';
import { RequestManager } from 'types/util/requestManage';
import { IWallet } from 'types/wallet';
import { IExtractArgumentsIntoObjectResult, TExtractArg } from './chainMethod';
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
export interface IGetChainStatus {
  ChainId: string;
  Branches: {
    [key in string]: number;
  };
  NotLinkedBlocks: {
    [key in string]: number;
  };
  LongestChainHeight: number;
  LongestChainHash: string;
  GenesisBlockHash: string;
  GenesisContractAddress: string;
  LastIrreversibleBlockHash: string;
  LastIrreversibleBlockHeight: number;
  BestChainHash: string;
  BestChainHeight: number;
}

export interface IGetChainState {
  BlockHash: string;
  PreviousHash: string;
  BlockHeight: number;
  Changes: {
    [key in string]: string;
  };
  Deletes: [string];
}

export interface IGetBlock {
  BlockHash: string;
  Header: {
    PreviousBlockHash: string;
    MerkleTreeRootOfTransactions: string;
    MerkleTreeRootOfWorldState: string;
    MerkleTreeRootOfTransactionState: string;
    Extra: string;
    Height: number;
    Time: string;
    ChainId: string;
    Bloom: string;
    SignerPubkey: string;
  };
  Body: {
    TransactionsCount: number;
    Transactions: string[];
  };
  BlockSize: number;
}

export interface IGetBlockByHeight {
  BlockHash: string;
  Header: {
    PreviousBlockHash: string;
    MerkleTreeRootOfTransactions: string;
    MerkleTreeRootOfWorldState: string;
    MerkleTreeRootOfTransactionState: string;
    Extra: string;
    Height: number;
    Time: string;
    ChainId: string;
    Bloom: string;
    SignerPubkey: string;
  };
  Body: {
    TransactionsCount: number;
    Transactions: string[];
  };
  BlockSize: number;
}

export interface IGetTransactionResult {
  TransactionId: string;
  Status: string;
  Logs: {
    Address: string;
    Name: string;
    Indexed: string[];
    NonIndexed: string;
  }[];
  Bloom: string;
  BlockNumber: number;
  BlockHash: string;
  Transaction: {
    From: string;
    To: string;
    RefBlockNumber: number;
    RefBlockPrefix: string;
    MethodName: string;
    Params: string;
    Signature: string;
  };
  ReturnValue: string;
  Error: string;
  TransactionSize: number;
}
export interface IGetMerklePathByTxId {
  MerklePathNodes: {
    Hash: string;
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
export interface IGetTransactionPoolStatus {
  Queued: number;
  Validated: number;
}

export interface IGetPeer {
  IpAddress: string;
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
    address: string,
    wallet: IWallet,
    args: { [k in string]: any }
  ): Contract | Promise<Contract>;
  public getMerklePath(
    txId: string,
    height: number,
    args: { [k in string]: any }
  ): any[] | null | Promise<any[] | null>;
  getChainStatus(): Promise<IGetChainStatus & IError>;
  getChainState(blockHash: string): Promise<IGetChainState & IError>;
  getContractFileDescriptorSet(address: string): Promise<string & IError>;
  getBlockHeight(): number;
  getBlock(
    blockHash: string,
    includeTransactions: boolean
  ): Promise<IGetBlock & IError>;
  getBlockByHeight(
    blockHeight: number,
    includeTransactions?: boolean
  ): Promise<IGetBlockByHeight & IError>;
  getTxResult(transactionId: string): Promise<IGetTransactionResult & IError>;
  getTxResults(
    blockHash: string,
    offset: number,
    limit: number
  ): Promise<IGetTransactionResult[] & IError>;
  getMerklePathByTxId(
    transactionId: string
  ): Promise<IGetMerklePathByTxId & IError>;
  getTransactionPoolStatus(): Promise<IGetTransactionPoolStatus & IError>;
  sendTransaction(
    RawTransaction: string
  ): Promise<{ TransactionId: string } & IError>;
  sendTransactions(RawTransaction: string): Promise<string[] & IError>;
  calculateTransactionFee(
    RawTransaction: string
  ): Promise<ICalculateTransactionFee & IError>;
  callReadOnly(RawTransaction: string): Promise<string & IError>;
  getPeers(withMetrics?: boolean): Promise<IGetPeer[] & IError>;
  addPeer(Address: string): Promise<true & IError>;
  removePeer(address: string): Promise<true & IError>;
  networkInfo(): Promise<
    {
      Version: string;
      ProtocolVersion: number;
      Connections: number;
    } & IError
  >;
}
export default Chain;
