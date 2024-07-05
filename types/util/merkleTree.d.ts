type TMessage = string | number[] | ArrayBuffer | Uint8Array;
export declare function computeRoot(data: Array<Buffer>): Buffer | null;
export declare function getMerklePath(
  index: number,
  data: Array<Buffer>
): Array<Buffer> | null;
export function node(buffer: TMessage): Buffer;
