import { Transaction } from './proto.js';
import wallet from '../wallet/index.js';
import { encodeAddress, OUTPUT_TRANSFORMERS, transform, transformArrayToMap } from './transform.js';
import { unpackSpecifiedTypeData } from './utils.js';
import sha256 from './sha256.js';

const { getSignature } = wallet;

/**
 * sign a transaction
 *
 * @alias module:AElf/wallet
 * @param {Object} rawTxn rawTxn
 * @param {Object} keyPair Any standard key pair
 * @return {Object} wallet
 *
 * @Example
 * const rawTxn = proto.getTransaction(
 *    'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9',
 *    'ELF_65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9',
 *    'test',
 *    []
 * );
 * const signWallet = aelf.wallet.signTransaction(rawTxn, wallet.keyPair);
 */
export const signTransaction = (rawTxn, keyPair) => {
  let { params } = rawTxn;
  if (params.length === 0) {
    params = null;
  }
  // proto in proto.Transaction use proto2, but C# use proto3
  // proto3 will remove the default value key.
  // The differences between proto2 and proto3:
  // https://blog.csdn.net/huanggang982/article/details/77944174
  const ser = Transaction.encode(rawTxn).finish();
  const sig = getSignature(ser, keyPair);
  return {
    ...rawTxn,
    params,
    signature: sig
  };
};

export function deserializeTransaction(rawTx, paramsDataType) {
  const { from, to, params, refBlockPrefix, signature, ...rest } = unpackSpecifiedTypeData({
    data: rawTx,
    dataType: Transaction
  });
  let methodParameters = unpackSpecifiedTypeData({
    data: params,
    encoding: 'base64',
    dataType: paramsDataType
  });
  methodParameters = transform(paramsDataType, methodParameters, OUTPUT_TRANSFORMERS);
  methodParameters = transformArrayToMap(paramsDataType, methodParameters);

  return {
    from: encodeAddress(from.value),
    to: encodeAddress(to.value),
    params: methodParameters,
    refBlockPrefix: Buffer.from(refBlockPrefix, 'base64').toString('hex'),
    signature: Buffer.from(signature, 'base64').toString('hex'),
    ...rest
  };
}

/**
 *
 * Use rawTransaction to get transaction id
 * @param {String} rawTx rawTransaction
 * @return {String} string
 *
 * const txId = getTransactionId('0a220a2071a4dc8cdf109bd72913c90c3fc666c78d080cdda0da7f3abbc7105c6b651fd512220a2089ac786c8ad3b56f63a6f2767369a5273f801de2415b613c783cad3d148ce3ab18d5d3bb35220491cf6ba12a18537761704578616374546f6b656e73466f72546f6b656e73325008c0f7f27110bbe5947c1a09534752544553542d311a03454c4622220a2071a4dc8cdf109bd72913c90c3fc666c78d080cdda0da7f3abbc7105c6b651fd52a08088996ceb0061000320631323334353682f10441ec6ad50c4b210976ba0ba5c287ab6fabd0c444839e2505ecb1b5f52838095b290cb245ec1c97dade3bde6ac14c6892e526569e9b71240d3c120b1a6c8e41afba00');
 * console.log(txId);
 * // => cf564f3169012cb173efcf5543b2a71b030b16fad3ddefe3e04a5c1e1bc0047d
 */
export function getTransactionId(rawTx) {
  const hash = Buffer.from(rawTx.replace('0x', ''), 'hex');
  const decode = Transaction.decode(hash);
  decode.signature = null;
  const encode = Transaction.encode(decode).finish();
  return sha256(encode);
}
