import HttpProvider from "./util/httpProvider";
import Wallet from "./wallet/index";

declare namespace AElf {}
export declare class AElf {
  provider: HttpProvider;
  static wallet: Wallet;
  isConnected(): boolean;
  setProvider(provider: HttpProvider): void;
}
export default AElf;
