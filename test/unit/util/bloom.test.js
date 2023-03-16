import {
  isInBloom,
  isAddressInBloom,
  isEventInBloom,
  isIndexedInBloom,
  __RewireAPI__ as BloomModuleRewireAPI,
} from '../../../src/util/bloom';
import { keccak256 } from '../../../src/util/hash';
const bloom =
  'AAAAAAAAAAAAAAAAAAAAAAAIAAQAAQAAAAABAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAABAAIAEAAAAAAAAQAEQAAAACQAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAgACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAACAAAAAAAABQAAAAAAAEAAAAAACAA==';
const bloomFilter =
  '0x08200081a06415012858022200cc48143008908c0000824e5405b41520795989024800380a8d4b198910b422b231086c3a62cc402e2573070306f180446440ad401016c3e30781115844d028c89028008a12240c0a2c184c0425b90d7af0530002f981221aa565809132000818c82805023a132a25150400010530ba0080420a10a137054454021882505080a6b6841082d84151010400ba8100c8802d440d060388084052c1300105a0868410648a40540c0f0460e190400807008914361118000a5202e94445ccc088311050052c8002807205212a090d90ba428030266024a910644b1042011aaae05391cc2094c45226400000380880241282ce4e12518c';
const upperBloomFilter =
  '0x08200081A06415012858022200CC48143008908C0000824E5405B41520795989024800380A8D4B198910B422B231086C3A62CC402E2573070306F180446440AD401016C3E30781115844D028C89028008A12240C0A2C184C0425B90D7AF0530002F981221AA565809132000818C82805023A132A25150400010530BA0080420A10A137054454021882505080A6B6841082D84151010400BA8100C8802D440D060388084052C1300105A0868410648A40540C0F0460E190400807008914361118000A5202E94445CCC088311050052C8002807205212A090D90BA428030266024A910644B1042011AAAE05391CC2094C45226400000380880241282CE4E12518C';
describe('test bloom',() => {
  test('test is in', () => {
    const buffer = Buffer.from(bloom, 'base64').toString('hex');
    expect(
      isInBloom(
        buffer,
        '6d747b334438d2e808fe3a3977ef8a752af0b833f5d4b9cc21d7f12bea7f6683'
      )
    ).toBeTruthy();
    expect(isInBloom(buffer, 'Burned')).toBeFalsy();
    expect(() => isInBloom(bloom, 'Burned')).toThrow();
  });
  test('should return true if value is in bloom passing in hex string',() => {
    const hash = keccak256(
      '0x58a4884182d9e835597f405e5f258290e46ae7c2'
    ).replace('0x','');
    expect(
      isInBloom(
        bloomFilter,
        hash
      )
    ).toEqual(true);
    expect(isInBloom(upperBloomFilter, hash)).toEqual(true);
  })
  test('should return false if value is not in bloom', () => {
    expect(
      isInBloom(bloomFilter, '0x494bfa3a4576ba6cfe835b0deb78834f0c3e3996')
    ).toEqual(false);
  });
  test('should throw error if value is not valid bloom',() => {
    expect(() =>
      isInBloom(null, '0x494bfa3a4576ba6cfe835b0deb78834f0c3e3996')
    ).toThrow('Invalid Bloom');
    expect(() =>
      isInBloom({}, '0x494bfa3a4576ba6cfe835b0deb78834f0c3e3996')
    ).toThrow('Invalid Bloom');
    expect(() =>
      isInBloom(
        Buffer.from('test'),
        '0x494bfa3a4576ba6cfe835b0deb78834f0c3e3996'
      )
    ).toThrow('Invalid Bloom');
  });
  test('code point to int',() => {
    const codePointToInt =
      BloomModuleRewireAPI.__GetDependency__('codePointToInt');
    expect(() => codePointToInt(0)).toThrow('invalid bloom');
    console.log(BloomModuleRewireAPI.__get__('codePointToInt'));
  })
  test('test is event in', () => {
    expect(isEventInBloom(bloom, 'Burned')).toBeTruthy();
    expect(isEventInBloom(bloom, 'DonationReceived')).toBeTruthy();
    expect(isEventInBloom(bloom, 'Transferred')).toBeTruthy();
    expect(isEventInBloom(bloom, 'Buy')).toBeFalsy();
  });

  test('test is address in', () => {
    expect(
      isAddressInBloom(
        bloom,
        '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB'
      )
    ).toBeTruthy();
    expect(
      isAddressInBloom(
        bloom,
        'WnV9Gv3gioSh3Vgaw8SSB96nV8fWUNxuVozCf6Y14e7RXyGaM'
      )
    ).toBeTruthy();
    expect(
      isAddressInBloom(
        bloom,
        '2ZYyxEH6j8zAyJjef6Spa99Jx2zf5GbFktyAQEBPWLCvuSAn8D'
      )
    ).toBeFalsy();
  });

  test('test is indexed in', () => {
    expect(isIndexedInBloom(bloom, 'GgNFTEY=')).toBeTruthy();
    expect(
      isIndexedInBloom(
        bloom,
        'EiIKINKC9FMrc0WJpkCbYdLFIFrUqETROvXFUx+ve392A0R5'
      )
    ).toBeTruthy();
    expect(
      isIndexedInBloom(
        bloom,
        'CiIKII08D3yDyP0Gn2SK++fkQ/X88sX9fcOuY5hKUWmK8PDn'
      )
    ).toBeTruthy();
  });
});
