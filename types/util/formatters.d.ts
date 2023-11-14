import { Message } from '@aelfqueen/protobufjs';
import { IAddress, TAddress } from './proto';
export function inputAddressFormatter(address: TAddress | IAddress): string;
export function outputFileDescriptorSetFormatter(result: string): Message<{}>;
