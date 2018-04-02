import Client from '../Client';

describe('Client', () => {
  afterEach(() => {
    // @ts-ignore: jest-fetch-mock
    fetch.resetMocks();
  });

  describe('LOGIN_ENDPOINT', () => {
    it('contains the login endpoint for Giant Bomb', () => {
      expect(Client.LOGIN_ENDPOINT).toBe(
        'https://www.giantbomb.com/app/gb-player/activate'
      );
    });
  });

  describe('getCodeAsync', () => {
    const RESPONSE_XML =
      '<result><status>success</status><retryInterval>5</retryInterval><retryDuration>900</retryDuration><regCode>1C1223</regCode></result>';

    it('should send a request with the correct params', async () => {
      expect.assertions(1);

      // @ts-ignore: jest-fetch-mock
      fetch.mockResponseOnce(RESPONSE_XML);

      const client = new Client();
      const result = await client.getCodeAsync();

      // @ts-ignore: jest-fetch-mock
      expect(fetch.mock.calls[0][0]).toBe(
        'https://www.giantbomb.com/app/gb-player/get-code?deviceID=gb-player'
      );
    });

    it('should return a GetCode result', async () => {
      expect.assertions(4);

      // @ts-ignore: jest-fetch-mock
      fetch.mockResponseOnce(RESPONSE_XML);

      const client = new Client();
      const result = await client.getCodeAsync();

      expect(result.regCode).toBe('1C1223');
      expect(result.retryDuration).toBe(900);
      expect(result.retryInterval).toBe(5);
      expect(result.status).toBe('success');
    });
  });

  describe('getResultAsync', () => {
    const RESPONSE_XML =
      '<result><status>failure</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken/><customerId>0</customerId></result>';

    it('should send a request with the correct params', async () => {
      expect.assertions(1);

      // @ts-ignore: jest-fetch-mock
      fetch.mockResponseOnce(RESPONSE_XML);

      const client = new Client();
      const result = await client.getResultAsync('1C1223');

      // @ts-ignore: jest-fetch-mock
      expect(fetch.mock.calls[0][0]).toBe(
        'https://www.giantbomb.com/app/gb-player/get-result?deviceID=gb-player&regCode=1C1223'
      );
    });

    it('should return a GetResult result with failure status', async () => {
      expect.assertions(4);

      // @ts-ignore: jest-fetch-mock
      fetch.mockResponseOnce(RESPONSE_XML);

      const client = new Client();
      const result = await client.getResultAsync('1C1223');

      expect(result.status).toBe('failure');
      expect(result.creationTime).toBe('2018-03-31 14:48:19.000000');
      expect(result.regToken).toBe('');
      expect(result.customerId).toBe(0);
    });

    it('should return a GetResult result with success status', async () => {
      expect.assertions(4);

      // @ts-ignore: jest-fetch-mock
      fetch.mockResponseOnce(
        '<result><status>success</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken>A12345</regToken><customerId>0</customerId></result>'
      );

      const client = new Client();
      const result = await client.getResultAsync('1C1223');

      expect(result.status).toBe('success');
      expect(result.creationTime).toBe('2018-03-31 14:48:19.000000');
      expect(result.regToken).toBe('A12345');
      expect(result.customerId).toBe(0);
    });
  });
});
