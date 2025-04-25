// import ContractMultiTransaction from '../../../src/contract/contractMultiTransaction';
// import ContractFactory from '../../../src/contract/index';
// import AElf from '../../../src/index';
// const stageEndpoint = 'https://tdvw-test-node.aelf.io/';

// // CHAIN_MAP = {
// //   AELF: 9992731,
// //   tDVV: 1866392,
// //   tDVW: 1931928
// // };

// describe('contract multi transaction', () => {
//   const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
//   const wallet = AElf.wallet.getWalletByPrivateKey('943df6d39fd1e1cc6ae9813e54f7b9988cf952814f9c31e37744b52594cb4096');
//   const address = 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx';
//   const chain = aelf.chain;
//   let contract, contractMultiTransaction;
//   beforeAll(async () => {
//     contract = await chain.contractAt(address);
//     contractMultiTransaction = new ContractMultiTransaction(contract, wallet, {
//       multi: {
//         9992731: {
//           chainUrl: 'https://aelf-test-node.aelf.io/',
//           contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE'
//         },
//         1931928: {
//           chainUrl: 'https://tdvw-test-node.aelf.io/',
//           contractAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx'
//         }
//       },
//       gatewayUrl: 'https://gateway-test.aelf.io'
//     });
//   });
//   test('send multi transaction to gateway', async () => {
//     const expectedKeys = ['1931928', '9992731'];
//     const result = await contractMultiTransaction.sendMultiTransactionToGateway({
//       9992731: {
//         method: 'Transfer',
//         params: {
//           symbol: 'ELF',
//           amount: '100000000',
//           to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//         }
//       },
//       1931928: {
//         method: 'Transfer',
//         params: {
//           symbol: 'ELF',
//           amount: '150000000',
//           to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//         }
//       }
//     });
//     expect(Object.keys(result)).toEqual(expectedKeys);
//     expectedKeys.forEach(key => {
//       expect(Array.isArray(result[key])).toBe(true);
//       result[key].forEach(value => {
//         expect(typeof value).toBe('string');
//       });
//     });
//   });
//   test('send multi transaction to gateway with invalid method', async () => {
//     try {
//       const result = await contractMultiTransaction.sendMultiTransactionToGateway({
//         9992731: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '100000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         },
//         1931928: {
//           params: {
//             symbol: 'ELF',
//             amount: '150000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         }
//       });
//     } catch (error) {
//       expect(error).toBeInstanceOf(Error);
//       expect(error.message).toBe('Method undefined not found');
//     }
//   });
//   test('send multi transaction to gateway with invalid input', async () => {
//     try {
//       const result = await contractMultiTransaction.sendMultiTransactionToGateway({
//         9992731: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '100000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         },
//         1931928: {
//           method: 'Transfer'
//         }
//       });
//     } catch (error) {
//       expect(error).toBeInstanceOf(Error);
//       expect(error.message).toBe("Cannot read properties of undefined (reading 'length')");
//     }
//   });
//   test('send multi transaction to gateway with callback', async () => {
//     const expectedKeys = ['1931928', '9992731'];
//     let callbackData;
//     await contractMultiTransaction.sendMultiTransactionToGateway(
//       {
//         9992731: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '100000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         },
//         1931928: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '150000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         }
//       },
//       data => {
//         callbackData = data;
//       }
//     );
//     expect(Object.keys(callbackData)).toEqual(expectedKeys);
//     expectedKeys.forEach(key => {
//       expect(Array.isArray(callbackData[key])).toBe(true);
//       callbackData[key].forEach(value => {
//         expect(typeof value).toBe('string');
//       });
//     });
//   });
//   test('send multi transaction to gateway with refBlockNumberStrategy', async () => {
//     const expectedKeys = ['1931928', '9992731'];
//     const result = await contractMultiTransaction.sendMultiTransactionToGateway(
//       {
//         9992731: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '100000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         },
//         1931928: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '150000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         }
//       },
//       {
//         refBlockNumberStrategy: {
//           9992731: -8,
//           1931928: -8
//         }
//       }
//     );
//     expect(Object.keys(result)).toEqual(expectedKeys);
//     expectedKeys.forEach(key => {
//       expect(Array.isArray(result[key])).toBe(true);
//       result[key].forEach(value => {
//         expect(typeof value).toBe('string');
//       });
//     });
//   });
//   test('sync send multi transaction to gateway', async () => {
//     const expectedKeys = ['1931928', '9992731'];
//     const result = contractMultiTransaction.sendMultiTransactionToGateway(
//       {
//         9992731: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '100000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         },
//         1931928: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '150000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         }
//       },
//       {
//         sync: true
//       }
//     );
//     expect(Object.keys(result)).toEqual(expectedKeys);
//     expectedKeys.forEach(key => {
//       expect(Array.isArray(result[key])).toBe(true);
//       result[key].forEach(value => {
//         expect(typeof value).toBe('string');
//       });
//     });
//   });
// });

// describe('multi transaction with refBlockNumberStrategy', () => {
//   const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
//   const wallet = AElf.wallet.getWalletByPrivateKey('943df6d39fd1e1cc6ae9813e54f7b9988cf952814f9c31e37744b52594cb4096');
//   const address = 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx';
//   const chain = aelf.chain;
//   let contract, contractMultiTransaction;
//   beforeAll(async () => {
//     contract = await chain.contractAt(address);
//     contractMultiTransaction = new ContractMultiTransaction(contract, wallet, {
//       refBlockNumberStrategy: {
//         9992731: -8,
//         1931928: -8
//       },
//       multi: {
//         9992731: {
//           chainUrl: 'https://aelf-test-node.aelf.io/',
//           contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE'
//         },
//         1931928: {
//           chainUrl: 'https://tdvw-test-node.aelf.io/',
//           contractAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx'
//         }
//       },
//       gatewayUrl: 'https://gateway-test.aelf.io'
//     });
//   });
//   test('send multi transaction to gateway', async () => {
//     const expectedKeys = ['1931928', '9992731'];
//     const result = await contractMultiTransaction.sendMultiTransactionToGateway({
//       9992731: {
//         method: 'Transfer',
//         params: {
//           symbol: 'ELF',
//           amount: '100000000',
//           to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//         }
//       },
//       1931928: {
//         method: 'Transfer',
//         params: {
//           symbol: 'ELF',
//           amount: '150000000',
//           to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//         }
//       }
//     });
//     expect(Object.keys(result)).toEqual(expectedKeys);
//     expectedKeys.forEach(key => {
//       expect(Array.isArray(result[key])).toBe(true);
//       result[key].forEach(value => {
//         expect(typeof value).toBe('string');
//       });
//     });
//   });
//   test('sync send multi transaction to gateway', async () => {
//     const expectedKeys = ['1931928', '9992731'];
//     const result = contractMultiTransaction.sendMultiTransactionToGateway(
//       {
//         9992731: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '100000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         },
//         1931928: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '150000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         }
//       },
//       {
//         sync: true
//       }
//     );
//     expect(Object.keys(result)).toEqual(expectedKeys);
//     expectedKeys.forEach(key => {
//       expect(Array.isArray(result[key])).toBe(true);
//       result[key].forEach(value => {
//         expect(typeof value).toBe('string');
//       });
//     });
//   });
// });

// describe('multi transaction with invalid multi options', () => {
//   const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
//   const wallet = AElf.wallet.getWalletByPrivateKey('943df6d39fd1e1cc6ae9813e54f7b9988cf952814f9c31e37744b52594cb4096');
//   const address = 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx';
//   const chain = aelf.chain;
//   let contract, contractMultiTransaction;
//   beforeAll(async () => {
//     contract = await chain.contractAt(address);
//     contractMultiTransaction = new ContractMultiTransaction(contract, wallet, {
//       gatewayUrl: 'https://gateway-test.aelf.io'
//     });
//   });
//   test('test handle transaction', async () => {
//     expect(() =>
//       contractMultiTransaction.sendMultiTransactionToGateway({
//         9992731: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '100000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         },
//         1931928: {
//           method: 'Transfer',
//           params: {
//             symbol: 'ELF',
//             amount: '150000000',
//             to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//           }
//         }
//       })
//     ).toThrow('Please set the chainInfo in option multi');
//   });
// });

// describe('multi transaction with invalid refBlockNumberStrategy options', () => {
//   const aelf = new AElf(new AElf.providers.HttpProvider(stageEndpoint));
//   const wallet = AElf.wallet.getWalletByPrivateKey('943df6d39fd1e1cc6ae9813e54f7b9988cf952814f9c31e37744b52594cb4096');
//   const address = 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx';
//   const chain = aelf.chain;
//   let contract, contractMultiTransaction;
//   beforeAll(async () => {
//     contract = await chain.contractAt(address);
//     contractMultiTransaction = new ContractMultiTransaction(contract, wallet, {
//       multi: {
//         9992731: {
//           chainUrl: 'https://aelf-test-node.aelf.io/',
//           contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE'
//         },
//         1931928: {
//           chainUrl: 'https://tdvw-test-node.aelf.io/',
//           contractAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx'
//         }
//       },
//       gatewayUrl: 'https://gateway-test.aelf.io'
//     });
//   });
//   test('test handle transaction with refBlockNumberStrategy which is bigger than 0', async () => {
//     try {
//       await contractMultiTransaction.sendMultiTransactionToGateway(
//         {
//           9992731: {
//             method: 'Transfer',
//             params: {
//               symbol: 'ELF',
//               amount: '100000000',
//               to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//             }
//           },
//           1931928: {
//             method: 'Transfer',
//             params: {
//               symbol: 'ELF',
//               amount: '150000000',
//               to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//             }
//           }
//         },
//         {
//           refBlockNumberStrategy: {
//             9992731: 8,
//             1931928: -8
//           }
//         }
//       );
//     } catch (error) {
//       expect(error).toBeInstanceOf(Error);
//       expect(error.message).toBe('refBlockNumberStrategy must be less than 0');
//     }
//   });
//   test('test handle transaction with refBlockNumberStrategy which is not number', async () => {
//     try {
//       await contractMultiTransaction.sendMultiTransactionToGateway(
//         {
//           9992731: {
//             method: 'Transfer',
//             params: {
//               symbol: 'ELF',
//               amount: '100000000',
//               to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//             }
//           },
//           1931928: {
//             method: 'Transfer',
//             params: {
//               symbol: 'ELF',
//               amount: '150000000',
//               to: 'GyQX6t18kpwaD9XHXe1ToKxfov8mSeTLE9q9NwUAeTE8tULZk'
//             }
//           }
//         },
//         {
//           refBlockNumberStrategy: {
//             9992731: '-8',
//             1931928: -8
//           }
//         }
//       );
//     } catch (error) {
//       expect(error).toBeInstanceOf(Error);
//       expect(error.message).toBe('Invalid type, refBlockNumberStrategy must be number');
//     }
//   });
// });
