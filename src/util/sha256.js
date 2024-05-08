import { Sha256 } from "@aws-crypto/sha256-js";

const sha256 = (value) => {
  const hexStr = value;
  const hash = new Sha256();
  hash.update(hexStr);
  const hashUint8Array = hash.digestSync();
  return Buffer.from(hashUint8Array).toString("hex");
};
sha256.digest = (value) => {
  const hexStr = value;
  const hash = new Sha256();
  hash.update(hexStr);
  const hashUint8Array = hash.digestSync();
  return hashUint8Array;
};
sha256.array = sha256.digest;

export default sha256;
