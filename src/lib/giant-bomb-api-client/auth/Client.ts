import DataLayer from '../DataLayer';
import GetCode from './GetCode';
import GetCodeRequest from './GetCodeRequest';
import GetResult from './GetResult';
import GetResultRequest from './GetResultRequest';

const DEVICE_ID = 'gb-player';
const GIANT_BOMB_AUTH_ENDPOINT = 'https://www.giantbomb.com/app/' + DEVICE_ID;

/**
 * Client for authenticating users with Giant Bomb.
 *
 * @see https://www.giantbomb.com/forums/api-developers-3017/how-to-authenticate-a-gb-app-1807094/#8
 */
export default class Client {
  public static LOGIN_ENDPOINT = GIANT_BOMB_AUTH_ENDPOINT + '/activate';

  private _dataLayer: DataLayer;

  constructor() {
    this._dataLayer = new DataLayer(GIANT_BOMB_AUTH_ENDPOINT);
  }

  /**
   * Get the registration code that users need to enter into the login endpoint.
   */
  public async getCodeAsync(): Promise<GetCode> {
    const request = new GetCodeRequest({ deviceID: DEVICE_ID });

    return await this._dataLayer.fetch<GetCodeRequest, GetCode>(
      request,
      (response) => new GetCode(response.result)
    );
  }

  /**
   * Exchange the regCode from {@link getCodeAsync} for a regToken
   * @param getCodeResult The result returned by {@link getCodeAsync}
   */
  public async getResultAsync(regCode: string): Promise<GetResult> {
    const request = new GetResultRequest({
      regCode,
      deviceID: DEVICE_ID,
    });

    return await this._dataLayer.fetch<GetResultRequest, GetResult>(
      request,
      (response) => new GetResult(response.result)
    );
  }
}
