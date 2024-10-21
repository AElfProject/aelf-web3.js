/**
 * @file AElf-sdk index export
 * @author atom-yang
 */
import * as protobuf from '@aelfqueen/protobufjs/light.js';
import * as bloom from './util/bloom.js';
import Chain from './chain/index.js';
import RequestManager from './util/requestManage.js';
import HttpProvider from './util/httpProvider.js';
import wallet from './wallet/index.js';
import * as utils from './util/utils.js';
import * as proto from './util/proto.js';
import * as transform from './util/transform.js';
import Settings from './util/settings.js';
import sha256 from './util/sha256.js';

/* eslint-disable no-underscore-dangle */
export default class AElf {
  constructor(provider) {
    this._requestManager = new RequestManager(provider);
    this.currentProvider = provider;
    this.chain = new Chain(this._requestManager);
  }

  static version = process.env.SDK_VERSION;

  static providers = {
    HttpProvider
  };

  /**
   * @type {protobuf} export protobufjs for developers
   */
  static pbjs = protobuf;

  static pbUtils = proto;

  static wallet = wallet;

  static utils = {
    ...utils,
    ...bloom,
    sha256,
    transform
  };

  providers = {
    HttpProvider
  };

  settings = new Settings();

  /**
   * AElf-sdk version
   * @type {{api: string}}
   */
  version = {
    api: process.env.SDK_VERSION
  };

  /**
   * check the rpc node is work or not.
   * @returns {boolean} whether can connect to the rpc.
   */
  isConnected() {
    return this.currentProvider && this.currentProvider.isConnected();
  }

  setProvider(provider) {
    this._requestManager.setProvider(provider);
    this.currentProvider = provider;
  }
}
/* eslint-enable */
