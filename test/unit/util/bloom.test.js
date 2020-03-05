import {
  isAddressInBloom,
  isEventInBloom,
  isIndexedInBloom
} from '../../../src/util/bloom';

const bloom = 'AAAAAAAAAAAAAAAAAAAAAAAIAAQAAQAAAAABAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAABAAIAEAAAAAAAAQAEQAAAACQAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAgACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAACAAAAAAAABQAAAAAAAEAAAAAACAA==';

describe('test bloom', () => {
  test('test is event in', () => {
    expect(isEventInBloom(bloom, 'Burned')).toBeTruthy();
    expect(isEventInBloom(bloom, 'DonationReceived')).toBeTruthy();
    expect(isEventInBloom(bloom, 'Transferred')).toBeTruthy();
    expect(isEventInBloom(bloom, 'Buy')).toBeFalsy();
  });

  test('test is address in', () => {
    expect(isAddressInBloom(bloom, '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB')).toBeTruthy();
    expect(isAddressInBloom(bloom, 'WnV9Gv3gioSh3Vgaw8SSB96nV8fWUNxuVozCf6Y14e7RXyGaM')).toBeTruthy();
    expect(isAddressInBloom(bloom, '2ZYyxEH6j8zAyJjef6Spa99Jx2zf5GbFktyAQEBPWLCvuSAn8D')).toBeFalsy();
  });

  test('test is indexed in', () => {
    expect(isIndexedInBloom(bloom, 'GgNFTEY=')).toBeTruthy();
    expect(isIndexedInBloom(bloom, 'EiIKINKC9FMrc0WJpkCbYdLFIFrUqETROvXFUx+ve392A0R5')).toBeTruthy();
    expect(isIndexedInBloom(bloom, 'CiIKII08D3yDyP0Gn2SK++fkQ/X88sX9fcOuY5hKUWmK8PDn')).toBeTruthy();
  });
});
