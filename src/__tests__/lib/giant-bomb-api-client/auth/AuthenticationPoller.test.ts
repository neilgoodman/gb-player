import AuthenticationPoller from '../../../../lib/giant-bomb-api-client/auth/AuthenticationPoller';
import GetCode from '../../../../lib/giant-bomb-api-client/auth/GetCode';

describe('AuthenticationPoller', () => {
  const getCode = new GetCode({
    status: 'success',
    regCode: 'B1234',
    retryInterval: 1,
    retryDuration: 3,
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetAllMocks();

    // @ts-ignore: jest-fetch-mock
    fetch.resetMocks();
  });

  describe('startAsync', () => {
    it('should poll GetResult until a successful response', async () => {
      expect.assertions(2);

      fetch
        // @ts-ignore: jest-fetch-mock
        .mockResponseOnce(
          '<result><status>failure</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken/><customerId>0</customerId></result>'
        )
        .mockResponseOnce(
          '<result><status>success</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken>A12345</regToken><customerId>0</customerId></result>'
        );

      const authenticationPoller = new AuthenticationPoller(getCode);
      const result = authenticationPoller.startAsync();

      jest.runAllTimers();
      jest.runAllTimers();

      const resolvedResult = await result;

      expect(resolvedResult).not.toBeNull();
      // @ts-ignore: not-null is already asserted
      expect(resolvedResult.regToken).toBe('A12345');
    });

    it('should timeout while polling GetResult', async () => {
      expect.assertions(1);

      // @ts-ignore: jest-fetch-mock
      fetch.mockResponse(
        '<result><status>failure</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken/><customerId>0</customerId></result>'
      );

      const authenticationPoller = new AuthenticationPoller(getCode);
      const result = authenticationPoller.startAsync();

      jest.runAllTimers();
      jest.runAllTimers();
      jest.runAllTimers();

      const resolvedResult = await result;

      expect(resolvedResult).toBeNull();
    });
  });

  describe('stop', () => {
    it('should stop polling GetResult', async () => {
      expect.assertions(1);

      fetch
        // @ts-ignore: jest-fetch-mock
        .mockResponseOnce(
          '<result><status>failure</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken/><customerId>0</customerId></result>'
        )
        .mockResponseOnce(
          '<result><status>success</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken>A12345</regToken><customerId>0</customerId></result>'
        );

      const authenticationPoller = new AuthenticationPoller(getCode);
      const result = authenticationPoller.startAsync();

      authenticationPoller.stop();

      jest.runAllTimers();
      jest.runAllTimers();

      const resolvedResult = await result;

      expect(resolvedResult).toBeNull();
    });
  });

  describe('hasStarted', () => {
    it('should return true when polling has started', () => {
      // @ts-ignore: jest-fetch-mock
      fetch.mockResponse(
        '<result><status>failure</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken/><customerId>0</customerId></result>'
      );

      const authenticationPoller = new AuthenticationPoller(getCode);
      const result = authenticationPoller.startAsync();

      expect(authenticationPoller.hasStarted()).toBe(true);
    });

    it('should return false when polling has not started', () => {
      const authenticationPoller = new AuthenticationPoller(getCode);
      expect(authenticationPoller.hasStarted()).toBe(false);
    });
  });
});
