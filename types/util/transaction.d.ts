import { TRawTransaction } from './proto';
import { ec } from 'elliptic';
import { TRawTx } from '../contract/contractMethod';
import * as protobuf from '@aelfqueen/protobufjs/light';

interface SignatureObject {
  signature: Uint8Array;
}
type SignTransaction = SignatureObject & TRawTx;

export declare function signTransaction(rawTxn: TRawTransaction, keyPair: ec.KeyPair): SignTransaction;

export declare function deserializeTransaction(
  rawTx: ArrayBuffer | SharedArrayBuffer,
  paramsDataType: protobuf.Type
): { [k: string]: any };
