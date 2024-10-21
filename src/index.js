/**
 * @file AElf-sdk index export
 * @author atom-yang
 */
import * as protobuf from '@aelfqueen/protobufjs/light';
import * as bloom from './util/bloom';
import Chain from './chain';
import RequestManager from './util/requestManage';
import HttpProvider from './util/httpProvider';
import wallet from './wallet';
import * as utils from './util/utils';
import * as proto from './util/proto';
import * as transform from './util/transform';
import Settings from './util/settings';
import sha256 from './util/sha256';
/**
 * @typedef {import('@aelfqueen/protobufjs/light')} IProtobuf
 * @typedef {import('./util/proto')} IProto
 * @typedef {import('./wallet').default} IWallet
 * @typedef {import('../types/index').TUtilsType} TUtilsType
 */
/* eslint-disable no-underscore-dangle */
export default class AElf {
  /**
   * Creates an instance of AElf.
   * @param { HttpProvider} provider - The provider to connect to the RPC.
   */

  constructor(provider) {
    this._requestManager = new RequestManager(provider);
    this.currentProvider = provider;
    this.chain = new Chain(this._requestManager);
  }
  /** @type {string} The SDK version. */

  static version = process.env.SDK_VERSION;

  /** @type {{ HttpProvider: typeof HttpProvider }} The available providers. */

  static providers = {
    HttpProvider
  };

  /**
   * @type {IProtobuf} export protobufjs for developers
   */

  static pbjs = protobuf;
  /** @type {IProto} The protobuf utilities. */

  static pbUtils = proto;
  /** @type {IWallet} The wallet utility. */

  static wallet = wallet;
  /**
   * @type {TUtilsType} The utility functions, including bloom and sha256.
   */

  static utils = {
    ...utils,
    ...bloom,
    sha256,
    transform
  };
  /**
   * @typedef {Object} Providers
   * @property {HttpProvider} HttpProvider - The HTTP provider for the SDK.
   */
  /** @type {Providers} The available providers. */

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
  /**
   * Sets the provider for the SDK.
   * @param {HttpProvider} provider - The new provider to use.
   */

  setProvider(provider) {
    this._requestManager.setProvider(provider);
    this.currentProvider = provider;
  }
}
/* eslint-enable */
