/**
 * @author hzz780
 * @file crossChain.js
 * @description 
 */

const TokenCrossChainBasic = require('./tokenCrossChainBasic');

module.exports = class CrossChain {
  constructor({
    sendInstance,
    receiveInstance,
    wallet,
    reQueryInterval = 5000
  }) {
    this.sendInstance = sendInstance;
    this.receiveInstance = receiveInstance;
    this.wallet = wallet;
    this.reQueryInterval = reQueryInterval;
  }

  async init() {
    this.tokenCrossChainInstance = new TokenCrossChainBasic({
      sendInstance: this.sendInstance,
      receiveInstance: this.receiveInstance
    });
    this.contractsAndChainIds = await this.tokenCrossChainInstance.init({
      wallet: this.wallet
    });
  }

  async send({
    to,
    symbol,
    amount,
    memo
  }) {
    const contractsAndChainIds = this.contractsAndChainIds;
    const tokenCrossChainInstance = this.tokenCrossChainInstance;
    // console.log('contractsAndChainIds:', contractsAndChainIds.chainIdSend);

    // const params = {
    //   to: receiveAddress,
    //   symbol: 'ELF',
    //   amount: 1,
    //   memo: 'HelloKitty cross chain transfer'
    //   // toChainId: chainIdConvertor.base58ToChainId(ChainIdReceive),
    //   // issueChainId: chainIdConvertor.base58ToChainId(ChainIdSend)
    // };
    const params = {
      to,
      symbol,
      amount,
      memo
    };

    const sendInfo = await tokenCrossChainInstance.send(contractsAndChainIds, params);
    return sendInfo;
  }

  async receive({
    crossTransferTxId,
  }) {
    const tokenCrossChainInstance = this.tokenCrossChainInstance;

    try {
      const receiveInfo = await tokenCrossChainInstance.receive({
        crossTransferTxId
      });
      return receiveInfo;
    } catch (error) {
      if (error.message) {
        let message = '';
        try {
          message = JSON.parse(error.message);
        } catch (e) {
          message = error.message;
        }
        // const message = JSON.parse(error.message);
        if (message.canReceive) {
          console.log('receiveInfo error canReceive: ', error);
          return new Promise((resolve, reject) => {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            console.log('after 3s, receiving the token & info again');
            setTimeout(async () => {
              resolve(await this.receive({
                crossTransferTxId
              }));
            }, this.reQueryInterval);
          });
        }
      }
      console.log('receiveInfo error: ', error);
      return {
        error: 1,
        messsage: error.message
      };
    }
  }
}
