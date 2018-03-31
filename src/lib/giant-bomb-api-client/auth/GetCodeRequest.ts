import { IRequest } from '../DataLayer';

export interface IGetCodeRequestParams {
  deviceID: string;
}

export default class GetCodeRequest implements IRequest {
  private _path: string;
  private _params: IGetCodeRequestParams;

  constructor(params: IGetCodeRequestParams) {
    this._path = '/get-code';
    this._params = { ...params };
  }

  public get path(): string {
    return this._path;
  }

  public get params(): IGetCodeRequestParams {
    return this._params;
  }
}
