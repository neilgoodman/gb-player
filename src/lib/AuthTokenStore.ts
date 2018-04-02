import { SecureStore } from 'expo';

const AUTH_TOKEN_STORE_KEY = 'gb-player-auth-token';

/**
 * Utility for storing the Giant Bomb API key locally on the device.
 */
export default class AUthTokenStore {
  /**
   * Get the Giant Bomb API key.
   *
   * Returns empty string if there is no API key available.
   */
  public static async getAsync(): Promise<string> {
    const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_STORE_KEY);
    return authToken == null ? '' : authToken;
  }

  /**
   * Stores the given API key to the device.
   * @param token The Giant Bomb API key to store.
   */
  public static async setAsync(token: string): Promise<void> {
    await SecureStore.setItemAsync(AUTH_TOKEN_STORE_KEY, token);
  }

  /**
   * Clears the API key from the device.
   */
  public static async clearAsync(): Promise<void> {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_STORE_KEY);
  }
}
