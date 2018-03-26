import fastXmlParser from 'fast-xml-parser';
import queryString from 'query-string';
import GetCodeResult from './GetCodeResult';
import GetResultResult from './GetResultResult';

const GIANT_BOMB_AUTH_ENDPOINT = 'https://www.giantbomb.com/app/gb-player';

/**
 * Client for authenticating users with Giant Bomb.
 *
 * @see https://www.giantbomb.com/forums/api-developers-3017/how-to-authenticate-a-gb-app-1807094/#8
 */
export default class Authenticator {
  /**
   * Return the endpoint that users will navigate to in order to authenticate.
   */
  public static getLoginEndpoint(): string {
    return GIANT_BOMB_AUTH_ENDPOINT + '/activate';
  }

  /**
   * Get the registration code that users need to enter into the login endpoint.
   */
  public static async getCodeAsync(): Promise<GetCodeResult> {
    const response = await fetch(
      GIANT_BOMB_AUTH_ENDPOINT + '/get-code?deviceID=gb-player'
    );
    const xmlString = await response.text();
    const getCodeResult = fastXmlParser.parse(xmlString);

    return new GetCodeResult(getCodeResult.result);
  }

  /**
   * Exchange the regCode from {@link getCodeAsync} for a regToken
   * @param getCodeResult The result returned by {@link getCodeAsync}
   */
  public static async getResultAsync(regCode: string) {
    const endpoint =
      GIANT_BOMB_AUTH_ENDPOINT +
      '/get-result?' +
      queryString.stringify({
        regCode,
        deviceID: 'gb-player',
      });
    const response = await fetch(endpoint);
    const xmlString = await response.text();
    const getResultResult = fastXmlParser.parse(xmlString);

    return new GetResultResult(getResultResult.result);
  }
}
