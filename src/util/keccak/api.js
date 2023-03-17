/* eslint-disable no-param-reassign */
const { Transform } = require('readable-stream');

module.exports = KeccakState => class Keccak extends Transform {
  constructor(rate, capacity, delimitedSuffix, hashBitLength, options) {
    super(options);

    this._rate = rate;
    this._capacity = capacity;
    this._delimitedSuffix = delimitedSuffix;
    this._hashBitLength = hashBitLength;
    this._options = options;

    this._state = new KeccakState();
    this._state.initialize(rate, capacity);
    this._finalized = false;
  }

  update(data, encoding) {
    if (!Buffer.isBuffer(data) && typeof data !== 'string') {
      throw new TypeError('Data must be a string or a buffer');
    }
    if (this._finalized) throw new Error('Digest already called');
    if (!Buffer.isBuffer(data)) data = Buffer.from(data, encoding);

    this._state.absorb(data);

    return this;
  }

  digest(encoding) {
    if (this._finalized) throw new Error('Digest already called');
    this._finalized = true;

    if (this._delimitedSuffix) { this._state.absorbLastFewBits(this._delimitedSuffix); }
    let digest = this._state.squeeze(this._hashBitLength / 8);
    if (encoding !== undefined) digest = digest.toString(encoding);

    this._resetState();

    return digest;
  }

  // remove result from memory
  _resetState() {
    this._state.initialize(this._rate, this._capacity);
    return this;
  }
};
