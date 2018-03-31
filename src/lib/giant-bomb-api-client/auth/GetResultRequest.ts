import { IRequest } from '../DataLayer';

export interface IGetResultParams {
  regCode: string;
  deviceID: string;
}

export default class GetCodeRequest implements IRequest {
  private _path: string;
  private _params: IGetResultParams;

  constructor(params: IGetResultParams) {
    this._path = '/get-result';
    this._params = { ...params };
  }

  public get path(): string {
    return this._path;
  }

  public get params(): IGetResultParams {
    return this._params;
  }
}
