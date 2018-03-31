export default class GetResult {
  private _status: string;
  private _creationTime: string;
  private _customerId: number;
  private _regToken: string;

  constructor({
    status,
    creationTime,
    customerId,
    regToken,
  }: {
    status: string;
    creationTime: string;
    customerId: number;
    regToken: string;
  }) {
    this._status = status;
    this._creationTime = creationTime;
    this._customerId = customerId;
    this._regToken = regToken;
  }

  public get status(): string {
    return this._status;
  }

  public get creationTime(): string {
    return this._creationTime;
  }

  public get customerId(): number {
    return this._customerId;
  }

  public get regToken(): string {
    return this._regToken;
  }
}
