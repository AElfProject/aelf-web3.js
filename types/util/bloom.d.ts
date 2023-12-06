import { Address, BlockHash } from './proto';

export declare function isInBloom(bloom: string, hash: BlockHash): boolean;
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
  address: Address
): boolean;
