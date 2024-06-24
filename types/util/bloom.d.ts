import { TAddress, TBlockHash } from './proto';

export declare function isInBloom(bloom: string, hash: TBlockHash): boolean;
export declare function isEventInBloom(
  bloom: string,
  eventName: string
): boolean;
export declare function isIndexedInBloom(
  bloom: string,
  indexed: string
): boolean;
export declare function isAddressInBloom(
  bloom: string,
  address: TAddress
): boolean;
