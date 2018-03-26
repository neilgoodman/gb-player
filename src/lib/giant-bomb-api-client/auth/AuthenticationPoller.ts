import Authenticator from './Authenticator';
import GetCodeResult from './GetCodeResult';
import GetResultResult from './GetResultResult';

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

export default class AuthenticationPoller {
  private _numberOfRetries: number;
  private _getCodeResult: GetCodeResult;
  private _timer?: number;
  private _hasStopped: boolean;

  constructor(getCodeResult: GetCodeResult) {
    this._numberOfRetries = 0;
    this._hasStopped = true;
    this._getCodeResult = getCodeResult;
  }

  public async startAsync(): Promise<GetResultResult | null> {
    this.stop();

    this._numberOfRetries = 0;
    this._hasStopped = false;
    let getResultResult: GetResultResult | null = null;

    while (getResultResult === null) {
      if (this._hasStopped) {
        break;
      }

      if (
        maxRetriesReached(
          this._numberOfRetries,
          this._getCodeResult.retryInterval,
          this._getCodeResult.retryDuration
        )
      ) {
        break;
      } else {
        this._numberOfRetries++;
      }

      getResultResult = await this._pollGetResult();
    }

    return getResultResult;
  }

  public stop(): void {
    this._hasStopped = true;
    if (this._timer !== undefined) {
      clearTimeout(this._timer);
      delete this._timer;
    }
  }

  public hasStarted(): boolean {
    return !this._hasStopped;
  }

  private async _pollGetResult(): Promise<GetResultResult | null> {
    return new Promise<GetResultResult | null>((resolve, reject) => {
      this._timer = setTimeout(async () => {
        try {
          const getResultResult = await Authenticator.getResultAsync(
            this._getCodeResult.regCode
          );

          if (getResultResult.status === 'success') {
            resolve(getResultResult);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      }, this._getCodeResult.retryInterval * ONE_SECOND_IN_MILLISECONDS);
    });
  }
}
