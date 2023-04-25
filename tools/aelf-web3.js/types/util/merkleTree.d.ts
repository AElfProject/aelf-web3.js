type Message = string | number[] | ArrayBuffer | Uint8Array;
export declare function computeRoot(data: Array<Buffer>): Buffer;
export declare function getMerklePath(
  index: number,
  data: Array<Buffer>
): Array<Buffer> | null;
export function node(buffer: Message): Buffer;
