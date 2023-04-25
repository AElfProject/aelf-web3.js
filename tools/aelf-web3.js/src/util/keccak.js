const createKeccakHash = require('keccak');

const keccak = bits => str => {
  let msg;
  if (str.slice(0, 2) === '0x') {
    msg = [];
    for (let i = 2, l = str.length; i < l; i += 2) {
      msg.push(parseInt(str.slice(i, i + 2), 16));
    }
    msg = Buffer.from(msg);
  } else {
    msg = str;
  }
  const instance = createKeccakHash(`keccak${bits}`);
  return `0x${instance.update(msg).digest('hex')}`;
};

export const keccak256 = keccak(256);
export const keccak512 = keccak(512);
export const keccak256s = keccak(256);
export const keccak512s = keccak(512);
