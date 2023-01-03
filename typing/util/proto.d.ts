export interface IAddress {
  value: Uint8Array;
}
export interface ITransaction {
  from: IAddress;
  to: IAddress;
  methodName: string;
  params: string;
}
export function getTransaction(
  from: string,
  to: string,
  methodName: string,
  params: string
): ITransaction;
