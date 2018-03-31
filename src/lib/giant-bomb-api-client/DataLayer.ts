import fastXmlParser from 'fast-xml-parser';
import queryString from 'query-string';

/**
 * A simple request interface used by the {@link DataLayer.fetch} method.
 */
export interface IRequest {
  path: string;
  params: object;
}

/**
 * A data layer built around the fetch API to send HTTP requests to Giant Bomb's API.
 *
 * The Giant Bomb API doesn't follow a strict REST pattern, instead it accepts GET requests
 * for all actions. Request data is always sent using querystring parameters and the result
 * is always an XML string.
 */
export default class DataLayer {
  private _baseUrl: string;
  private _apiKey?: string;

  /**
   * Constructor.
   *
   * @param baseUrl The baseUrl to send requests to (i.e. https://www.giantbomb.com/api).
   * @param apiKey A Giant Bomb API key. This is optional for the auth Client.
   */
  constructor(baseUrl: string, apiKey?: string) {
    this._baseUrl = baseUrl;
    this._apiKey = apiKey;
  }

  /**
   * Given a request object, make a GET HTTP request to the Giant Bomb API.
   *
   * @param request An object that implements the {@link IRequest} interface.
   * @param responseFactory A function that will produce an instance of V from the result of {@link fastXmlParser.parse}.
   */
  public async fetch<T extends IRequest, V>(
    request: T,
    responseFactory: (value: any) => V
  ): Promise<V> {
    let url = this._baseUrl + request.path;
    let params = request.params;

    // Attach the API key to the params if available.
    if (this._apiKey) {
      params = {
        api_key: this._apiKey,
        ...params,
      };
    }

    // Append the request parameters.
    url += '?' + queryString.stringify(params);

    const response = await fetch(url);
    const xmlString = await response.text();
    const result = fastXmlParser.parse(xmlString);

    return responseFactory(result);
  }
}
