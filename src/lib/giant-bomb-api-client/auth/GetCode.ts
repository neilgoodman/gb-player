export default class GetCode {
  private _status: string;
  private _retryInterval: number;
  private _retryDuration: number;
  private _regCode: string;

  constructor({
    status,
    retryInterval,
    retryDuration,
    regCode,
  }: {
    status: string;
    retryInterval: number;
    retryDuration: number;
    regCode: string;
  }) {
    this._status = status;
    this._retryInterval = retryInterval;
    this._retryDuration = retryDuration;
    this._regCode = regCode;
  }

  public get status(): string {
    return this._status;
  }

  public get retryInterval(): number {
    return this._retryInterval;
  }

  public get retryDuration(): number {
    return this._retryDuration;
  }

  public get regCode(): string {
    return this._regCode;
  }
}
