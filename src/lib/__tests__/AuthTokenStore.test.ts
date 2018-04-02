jest.mock('expo', () => {
  return {
    SecureStore: {
      getItemAsync: jest.fn(),
      setItemAsync: jest.fn().mockResolvedValueOnce(undefined),
      deleteItemAsync: jest.fn().mockResolvedValueOnce(undefined),
    },
  };
});

import { SecureStore } from 'expo';
import AuthTokenStore from '../AuthTokenStore';

describe('AuthTokenStore', () => {
  const TEST_API_KEY = 'test_api_key';
  const AUTH_TOKEN_STORE_KEY = 'gb-player-auth-token';

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAsync', () => {
    it('should return the API key if available', async () => {
      expect.assertions(1);

      // @ts-ignore: jest mock
      SecureStore.getItemAsync.mockResolvedValueOnce(TEST_API_KEY);

      const result = await AuthTokenStore.getAsync();

      expect(result).toBe(TEST_API_KEY);
    });

    it('should return empty if the API key is unavailble', async () => {
      expect.assertions(1);

      // @ts-ignore: jest mock
      SecureStore.getItemAsync.mockResolvedValueOnce(Promise.resolve());

      const result = await AuthTokenStore.getAsync();

      expect(result).toBe('');
    });
  });

  describe('setAsync', () => {
    it('should set the API key if given', async () => {
      expect.assertions(2);

      await AuthTokenStore.setAsync(TEST_API_KEY);

      // @ts-ignore: jest mock
      expect(SecureStore.setItemAsync.mock.calls[0][0]).toBe(
        AUTH_TOKEN_STORE_KEY
      );
      // @ts-ignore: jest mock
      expect(SecureStore.setItemAsync.mock.calls[0][1]).toBe(TEST_API_KEY);
    });
  });

  describe('clearAsync', async () => {
    it('should delete the API key', async () => {
      expect.assertions(1);

      await AuthTokenStore.clearAsync();

      // @ts-ignore: jest mock
      expect(SecureStore.deleteItemAsync).toBeCalledWith(AUTH_TOKEN_STORE_KEY);
    });
  });
});
