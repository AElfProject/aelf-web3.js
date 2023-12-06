interface Sha256 {
  (value: any): string;
  digest(value: any): Uint8Array;
  array(value: any): Uint8Array;
}

declare const sha256: Sha256;

export default sha256;
