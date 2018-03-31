import DataLayer, {
  IRequest,
} from '../../../lib/giant-bomb-api-client/DataLayer';

interface IResult {
  resultKey: string;
}

describe('DataLayer', () => {
  let request: IRequest;
  let responseFactory: (value: any) => IResult;
  const BASE_URL = 'http://fake.bogus';
  const API_KEY = '12345';

  beforeEach(() => {
    request = {
      path: '/request-path',
      params: { key1: 'value1', key2: 'value2' },
    };

    responseFactory = (value) => {
      return { resultKey: value.result.key };
    };

    // @ts-ignore: jest-fetch-mock
    fetch.mockResponseOnce('<result><key>testValue</key></result>');
  });

  afterEach(() => {
    // @ts-ignore: jest-fetch-mock
    fetch.resetMocks();
  });

  describe('fetch', () => {
    it('returns a result from a given request', async () => {
      expect.assertions(1);

      const dataLayer = new DataLayer(BASE_URL);
      const result = await dataLayer.fetch<IRequest, IResult>(
        request,
        responseFactory
      );

      expect(result.resultKey).toBe('testValue');
    });

    it('sends params for a given request', async () => {
      expect.assertions(1);

      const dataLayer = new DataLayer(BASE_URL);
      const result = await dataLayer.fetch<IRequest, IResult>(
        request,
        responseFactory
      );

      // @ts-ignore: jest-fetch-mock
      expect(fetch.mock.calls[0][0]).toBe(
        'http://fake.bogus/request-path?key1=value1&key2=value2'
      );
    });

    it('adds api_key to params for a given request', async () => {
      expect.assertions(1);

      // @ts-ignore: jest-fetch-mock
      fetch.mockResponseOnce('<result><key>testValue</key></result>');

      const dataLayer = new DataLayer(BASE_URL, API_KEY);
      const result = await dataLayer.fetch<IRequest, IResult>(
        request,
        responseFactory
      );

      // @ts-ignore: jest-fetch-mock
      expect(fetch.mock.calls[0][0]).toBe(
        'http://fake.bogus/request-path?api_key=12345&key1=value1&key2=value2'
      );
    });
  });
});
