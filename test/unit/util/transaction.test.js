import { deserializeTransaction } from '../../../src/util/utils';
import AElf from '../../../src/index';
import tokenProto from './token.proto.json';

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
});
