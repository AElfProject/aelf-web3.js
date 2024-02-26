import { Message } from '@aelfqueen/protobufjs';
import { IAddressObject, TAddress } from './proto';
export function inputAddressFormatter(
  address: TAddress | IAddressObject
): string;
export function outputFileDescriptorSetFormatter(result: string): Message<{}>;
