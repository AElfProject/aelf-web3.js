import { keccak256, keccak512 } from '../../../src/util/keccak';

describe('test hash', () => {
  test('test keccak256', () => {
    expect(keccak256('123')).toBe(
      '0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107'
    );
    expect(keccak256('0x10')).toBe(
      '0x967f2a2c7f3d22f9278175c1e6aa39cf9171db91dceacd5ee0f37c2e507b5abe'
    );
    expect(keccak256('测试')).toBe(
      '0x92237f84a32f1a873a08b5b5673cca2e102d31c4c6e4e57be7146137ab7263eb'
    );
    expect(keccak256('עִבְרִית')).toBe(
      '0x06dc92b80132d6481c4acafbcb3b42c9146c62ae26a7a58bac94ed69c2337aa7'
    );
    expect(keccak256('𠜎')).toBe(
      '0x16a7cc7a58444cbf7e939611910ddc82e7cba65a99d3e8e08cfcda53180a2180'
    );
    expect(
      keccak256(
        'a873e0c67ca639026b6683008f7aa6324d4979550e9bce064ca1e1fb97a30b147a24f3f666c0a72d71348ede701cf2d17e2253c34d1ec3b647dbcef2f879f4eb881c4830b791378c901eb725ea5c172316c6d606e0af7df4df7f76e490cd30b2badf45685f'
      )
    ).toBe(
      '0xb9cc0ad9794a5421af0747eeec33764b8c91b172ceb27d79fe3196a1438e4e18'
    );
  });
  test('test keccak512', () => {
    expect(keccak512('123')).toBe(
      '0x8ca32d950873fd2b5b34a7d79c4a294b2fd805abe3261beb04fab61a3b4b75609afd6478aa8d34e03f262d68bb09a2ba9d655e228c96723b2854838a6e613b9d'
    );
    expect(keccak512('0x10')).toBe(
      '0xb001948a61ea302020834365737a1d7464ab8bcc27115b7d71ab7d245ded3575cc1b77cd3f0d87fb11e72ad6c008bd14ded7cc8d05f83b8d58004885ab39ba75'
    );
    expect(keccak512('测试')).toBe(
      '0x8fc9f5e7635224915f6ed57ccb99212c689ab6ff409ddf8b063566ff0d88e4993adeb5c7b486ddeb6d8ed85c91435df6774b2e8fc08247e458283f40a89d5e98'
    );
    expect(keccak512('עִבְרִית')).toBe(
      '0x2688b4373bf42117872da97c9081a5d4c40e5c8ceb945ee880ecd6ffa10f4b0f699ef38f1414397f60e5be2f10b8eb35bc191ff0cca97785330ecb8502d4b2a9'
    );
    expect(keccak512('𠜎')).toBe(
      '0x8a2d72022ce19d989dbe6a0017faccbf5dc2e22c162d1c5eb168864d32dd1a71e1b4782652c148cf6ca47b77a72c96fff682e72bdfef0566d4b7cca3c9ccc59d'
    );
    expect(
      keccak512(
        'a873e0c67ca639026b6683008f7aa6324d4979550e9bce064ca1e1fb97a30b147a24f3f666c0a72d71348ede701cf2d17e2253c34d1ec3b647dbcef2f879f4eb881c4830b791378c901eb725ea5c172316c6d606e0af7df4df7f76e490cd30b2badf45685f'
      )
    ).toBe(
      '0x9bac736fcc0db4ee31f72d674fa609fa8999588e601659c3ac3a2e7a76fe38951b1b286dd2941af7261688270483569fa0085a087843cf435b4ee7ffdbba68c3'
    );
  });
});
