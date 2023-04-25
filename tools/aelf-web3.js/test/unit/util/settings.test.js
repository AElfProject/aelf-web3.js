import Settings from '../../../src/util/settings';
describe('test settings', () => {
  test('test constructor', () => {
    const settings = new Settings();
    expect(settings.defaultAccount).toBe(undefined);
  });
});
