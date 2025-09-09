/**
 * @file AElf-sdk constantsKeyStore
 * @author hzz780
 */
export const KEY_STORE_ERRORS = {
  INVALID_PASSWORD: {
    error: 200001,
    errorMessage: 'Password Error'
  },
  NOT_AELF_KEY_STORE: {
    error: 200002,
    errorMessage: 'Not a aelf key store'
  },
  WRONG_VERSION: {
    error: 200004,
    errorMessage: 'The version is incorrect'
  },
  WRONG_KEY_STORE_VERSION: {
    error: 200005,
    errorMessage: 'Not a V1 key store'
  }
};
