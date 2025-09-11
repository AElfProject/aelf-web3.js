import {
  unpackSpecifiedTypeData,
  getAuthorization,
} from '../../../src/util/utils';
import AElf from '../../../src/index';
import tokenProto from './token.proto.json';
import { Transaction } from '../../../src/util/proto';
import { getTransactionId, deserializeTransaction } from '../../../src/util/transaction.js';

describe('test deserializing transaction', () => {
  test('deserialize transaction', async () => {
    // const aelf = new AElf(new AElf.providers.HttpProvider('http://192.168.199.195:8007'));
    // const token = await aelf.chain.contractAt('7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX', AElf.wallet.createNewWallet());
    // const signed = token.Transfer.getSignedTx({
    //   to: "7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX",
    //   amount: "100000000",
    //   symbol: "ELF"
    // }, {
    //   height: 4690088,
    //   hash: 'fa60011cb256d662db3178908f5dce18fd508ad8ce3d336e973eed52fddc46e9'
    // });
    // console.log(signed);
    const dataType = AElf.pbjs.Root.fromJSON(tokenProto);
    const transferInput = dataType.lookupType('TransferInput');
    const encodedTransaction =
      '0a220a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb275468212220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba18a8a19e022204fa60011c2a085472616e73666572322e0a220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba1203454c461880c2d72f82f10441ad1647aa462a8859c7a699f22d6124c82a5239c90746ac67ebfd8e1a7b4a25f343733351162d205fc881ea62072e9fe0fad5f6113734309b6666f6812d6b7a6400';
    const decodedTransaction = deserializeTransaction(
      encodedTransaction,
      transferInput
    );
    // console.log(decodedTransaction);
    expect(decodedTransaction).toEqual({
      from: '3YFERHEVq1vBWiAQ5RiyDrFHdpFRfQiaNy5njERcw2RGubJ7f',
      to: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
      methodName: 'Transfer',
      refBlockNumber: '4690088',
      signature:
        'ad1647aa462a8859c7a699f22d6124c82a5239c90746ac67ebfd8e1a7b4a25f343733351162d205fc881ea62072e9fe0fad5f6113734309b6666f6812d6b7a6400',
      refBlockPrefix: 'fa60011c',
      params: {
        to: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
        amount: '100000000',
        memo: '',
        symbol: 'ELF',
      },
    });
  });
  test('unpack specified type data', () => {
    const encodedTransaction =
      '0a220a2005c3b3959caeee55b5db4004f6f9d76860aae818ce7b33d210a446ecb275468212220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba18a8a19e022204fa60011c2a085472616e73666572322e0a220a200e9a238616169860ba4fb502f8e87ce62db9ef321f29fd76d6e1ce30a0e0cdba1203454c461880c2d72f82f10441ad1647aa462a8859c7a699f22d6124c82a5239c90746ac67ebfd8e1a7b4a25f343733351162d205fc881ea62072e9fe0fad5f6113734309b6666f6812d6b7a6400';
    const result = unpackSpecifiedTypeData({
      data: encodedTransaction,
      dataType: Transaction,
    });
    expect(result).toEqual({
      from: { value: 'BcOzlZyu7lW120AE9vnXaGCq6BjOezPSEKRG7LJ1RoI=' },
      to: { value: 'DpojhhYWmGC6T7UC+Oh85i257zIfKf121uHOMKDgzbo=' },
      refBlockNumber: '4690088',
      refBlockPrefix: '+mABHA==',
      methodName: 'Transfer',
      params:
        'CiIKIA6aI4YWFphguk+1AvjofOYtue8yHyn9dtbhzjCg4M26EgNFTEYYgMLXLw==',
      signature:
        'rRZHqkYqiFnHppnyLWEkyCpSOckHRqxn6/2OGntKJfNDczNRFi0gX8iB6mIHLp/g+tX2ETc0MJtmZvaBLWt6ZAA=',
    });
  });
  test('authorization information', () => {
    const authorization = getAuthorization('test', 'pass');
    expect(authorization).toEqual('Basic dGVzdDpwYXNz');
  });
  test('test getTransactionId', () => {
    const txId = getTransactionId(
      '0a220a2071a4dc8cdf109bd72913c90c3fc666c78d080cdda0da7f3abbc7105c6b651fd512220a2089ac786c8ad3b56f63a6f2767369a5273f801de2415b613c783cad3d148ce3ab18d5d3bb35220491cf6ba12a18537761704578616374546f6b656e73466f72546f6b656e73325008c0f7f27110bbe5947c1a09534752544553542d311a03454c4622220a2071a4dc8cdf109bd72913c90c3fc666c78d080cdda0da7f3abbc7105c6b651fd52a08088996ceb0061000320631323334353682f10441ec6ad50c4b210976ba0ba5c287ab6fabd0c444839e2505ecb1b5f52838095b290cb245ec1c97dade3bde6ac14c6892e526569e9b71240d3c120b1a6c8e41afba00'
    );
    expect(txId).toEqual('cf564f3169012cb173efcf5543b2a71b030b16fad3ddefe3e04a5c1e1bc0047d');
  });
});
