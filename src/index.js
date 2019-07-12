/**
 * @file AElf-sdk index export
 * @author atom-yang
 */
import * as protobuf from '@aelfqueen/protobufjs/light';
import jsSha256 from 'js-sha256';
import Chain from './chain';
import RequestManager from './util/requestManage';
import HttpProvider from './util/httpProvider';
import wallet from './wallet';
import * as utils from './util/utils';
import * as proto from './util/proto';
import Settings from './util/settings';

const { sha256 } = jsSha256;
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
    sha256
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

  reset(keepIsSyncing) {
    this._requestManager.reset(keepIsSyncing);
    this.settings = new Settings();
  }

  setProvider(provider) {
    this._requestManager.setProvider(provider);
    this.currentProvider = provider;
  }
}
/* eslint-enable */
