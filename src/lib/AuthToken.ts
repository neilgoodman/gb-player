import { SecureStore } from 'expo';

const AUTH_TOKEN_STORE_KEY = 'gb-player-auth-token';

export default class AUthToken {
  public static async getAsync(): Promise<string> {
    const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_STORE_KEY);
    return authToken == null ? '' : authToken;
  }

  public static async setAsync(token: string): Promise<void> {
    await SecureStore.setItemAsync(AUTH_TOKEN_STORE_KEY, token);
  }

  public static async clearAsync(): Promise<void> {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_STORE_KEY);
  }
}
