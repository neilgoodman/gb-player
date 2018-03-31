import Client from './Client';
import GetCode from './GetCode';
import GetResult from './GetResult';

const ONE_SECOND_IN_MILLISECONDS = 1000;

/**
 * Determine if the maximum number of retries have been reached.
 *
 * @param numberOfRetries The number of times a retry has occured.
 * @param retryInterval The time to wait between retries.
 * @param retryDuration The total amount of time to retry.
 */
const maxRetriesReached = (
  numberOfRetries: number,
  retryInterval: number,
  retryDuration: number
) => {
  const totalRetriesInSeconds =
    numberOfRetries * (retryInterval * ONE_SECOND_IN_MILLISECONDS);
  const maxRetriesInSeconds = retryDuration * ONE_SECOND_IN_MILLISECONDS;

  return totalRetriesInSeconds >= maxRetriesInSeconds;
};

/**
 * Polls {@link Client.getResultAsync} until a success has been returned or
 * the timeout returned by {@link Client.getCodeAsync} is reached.
 */
export default class AuthenticationPoller {
  private _numberOfRetries: number;
  private _getCode: GetCode;
  private _timer?: number;
  private _hasStopped: boolean;
  private _client: Client;

  constructor(getCode: GetCode) {
    this._numberOfRetries = 0;
    this._hasStopped = true;
    this._getCode = getCode;
    this._client = new Client();
  }

  /**
   * Start polling {@link Client.getResultAsync}.
   */
  public async startAsync(): Promise<GetResult | null> {
    this.stop();

    this._numberOfRetries = 0;
    this._hasStopped = false;
    let getResult: GetResult | null = null;

    while (getResult === null) {
      if (this._hasStopped) {
        break;
      }

      if (
        maxRetriesReached(
          this._numberOfRetries,
          this._getCode.retryInterval,
          this._getCode.retryDuration
        )
      ) {
        break;
      } else {
        this._numberOfRetries++;
      }

      getResult = await this._pollGetResult();
    }

    return getResult;
  }

  /**
   * Stop polling {@link Client.getResultAsync}.
   */
  public stop(): void {
    this._hasStopped = true;
    if (this._timer !== undefined) {
      clearTimeout(this._timer);
      delete this._timer;
    }
  }

  /**
   * Returns true if polling has started.
   */
  public hasStarted(): boolean {
    return !this._hasStopped;
  }

  private async _pollGetResult(): Promise<GetResult | null> {
    return new Promise<GetResult | null>((resolve, reject) => {
      this._timer = setTimeout(async () => {
        if (this._hasStopped) {
          resolve(null);
          return;
        }

        try {
          const getResult = await this._client.getResultAsync(
            this._getCode.regCode
          );

          if (getResult.status === 'success') {
            resolve(getResult);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }, this._getCode.retryInterval * ONE_SECOND_IN_MILLISECONDS);
    });
  }
}
