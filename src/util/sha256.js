import { Sha256 } from '@aws-crypto/sha256-js';

const sha256 = value => {
  const hexStr = value;
  // if (Buffer.isBuffer(value)) hexStr = value.toString('hex');
  const hash = new Sha256();
  hash.update(hexStr);
  const hashUint8Array = hash.digestSync();
  return Buffer.from(hashUint8Array).toString('hex');
};

export default sha256;
