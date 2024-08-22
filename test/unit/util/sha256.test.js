import sha256 from '../../../src/util/sha256';

describe('test sha256', () => {
  test('test sha256 function', () => {
    const result = sha256('');
    expect(result).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
  });
  test('test sha256 array', () => {
    const result = sha256.array('').toString();
    expect(result).toBe(
      '227,176,196,66,152,252,28,20,154,251,244,200,153,111,185,36,39,174,65,228,100,155,147,76,164,149,153,27,120,82,184,85'
    );
  });
});
