import sha256 from './sha256';
/**
 * @typedef {import('../../types/util/merkleTree').TMessage} TMessage
 */
const fromTwoBuffers = data => {
  if (data.length !== 2) throw new TypeError('Wrong data size.');

  const compared = Buffer.compare(data[0], data[1]);
  if (compared > 0) {
    data.reverse();
  }

  let buffer = Buffer.concat(data);
  buffer = Buffer.from(sha256(buffer), 'hex');
  return buffer;
};

const generateMerkleTree = data => {
  if (data.length === 0) {
    return null;
  }

  if (data.length % 2 === 1) {
    data.push(data[data.length - 1]);
  }
  let nodeToAdd = data.length / 2;
  let newAdded = 0;
  let i = 0;
  while (i < data.length - 1) {
    const left = data[i++];
    const right = data[i++];
    data.push(fromTwoBuffers([left, right]));
    if (++newAdded === nodeToAdd) {
      // complete this row
      if (nodeToAdd % 2 === 1 && nodeToAdd !== 1) {
        nodeToAdd++;
        data.push(data[data.length - 1]);
      }
      // start a new row
      nodeToAdd /= 2;
      newAdded = 0;
    }
  }
  return data;
};

const generateMerklePath = (indexArg, leafCount, tree) => {
  let index = indexArg;
  if (tree.length === 0 || index >= leafCount) return null;

  let firstInRow = 0;
  let rowcount = leafCount;
  const path = [];
  while (index < tree.length - 1) {
    const neighbor = index % 2 === 0 ? index + 1 : index - 1;
    path.push(tree[neighbor]);
    rowcount = rowcount % 2 === 0 ? rowcount : rowcount + 1;
    const shift = Math.floor((index - firstInRow) / 2);
    firstInRow += rowcount;
    index = firstInRow + shift;
    rowcount /= 2;
  }
  return path;
};
/**
 * Compute the Merkle root of an array of buffers.
 *
 * @param {Buffer[]} data - The input data to generate the Merkle root from.
 * @returns {Buffer | null} - The Merkle root buffer, or null if the input is empty.
 */

export const computeRoot = data => {
  const merkleTree = generateMerkleTree(data);
  return merkleTree[merkleTree.length - 1];
};

/**
 * Get the Merkle proof path for a specific leaf node in the tree.
 *
 * @param {number} index - The index of the leaf node.
 * @param {Buffer[]} data - The input data to generate the Merkle path from.
 * @returns {Buffer[] | null} - The Merkle proof path as an array of buffers, or null if no path exists.
 */

export const getMerklePath = (index, data) => {
  const leafCount = data.length;
  const merkleTree = generateMerkleTree(data);
  return generateMerklePath(index, leafCount, merkleTree);
};

/**
 * Compute the SHA-256 hash of a buffer and return it.
 *
 * @param {TMessage} buffer - The input data to hash (string, array, or buffer).
 * @returns {Buffer} - The hashed buffer.
 */

export const node = buffer => Buffer.from(sha256(buffer), 'hex');
