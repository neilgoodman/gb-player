import GetCode from '../GetCode';
import GetResultPoller from '../GetResultPoller';

describe('GetResultPoller', () => {
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
      expect.assertions(3);

      fetch
        // @ts-ignore: jest-fetch-mock
        .mockResponseOnce(
          '<result><status>failure</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken/><customerId>0</customerId></result>'
        )
        .mockResponseOnce(
          '<result><status>success</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken>A12345</regToken><customerId>0</customerId></result>'
        );

      const getResultPoller = new GetResultPoller(getCode);
      const result = getResultPoller.startAsync();

      jest.runAllTimers();

      const resolvedResult = await result;

      expect(resolvedResult).not.toBeNull();
      // @ts-ignore: not-null is already asserted
      expect(resolvedResult.regToken).toBe('A12345');
      // @ts-ignore: jest-fetch-mock
      expect(fetch.mock.calls.length).toBe(2);
    });

    it('should timeout while polling GetResult', async () => {
      expect.assertions(2);

      // @ts-ignore: jest-fetch-mock
      fetch.mockResponse(
        '<result><status>failure</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken/><customerId>0</customerId></result>'
      );

      const getResultPoller = new GetResultPoller(getCode);
      const result = getResultPoller.startAsync();

      jest.runAllTimers();

      const resolvedResult = await result;

      expect(resolvedResult).toBeNull();
      // @ts-ignore: jest-fetch-mock
      expect(fetch.mock.calls.length).toBe(3);
    });

    it('should reject promise when an error is thrown from Client', async () => {
      expect.assertions(1);

      const ERROR_MESSAGE = 'fake 503 timeout error';

      // @ts-ignore: jest-fetch-mock
      fetch.mockReject(new Error(ERROR_MESSAGE));

      const getResultPoller = new GetResultPoller(getCode);
      const result = getResultPoller.startAsync();

      result.catch((error) => {
        expect(error.message).toBe(ERROR_MESSAGE);
      });

      jest.runAllTimers();
    });
  });

  describe('stop', () => {
    it('should stop polling GetResult', async () => {
      expect.assertions(2);

      fetch
        // @ts-ignore: jest-fetch-mock
        .mockResponseOnce(
          '<result><status>failure</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken/><customerId>0</customerId></result>'
        )
        .mockResponseOnce(
          '<result><status>success</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken>A12345</regToken><customerId>0</customerId></result>'
        );

      const getResultPoller = new GetResultPoller(getCode);
      const result = getResultPoller.startAsync();

      getResultPoller.stop();

      jest.runAllTimers();

      const resolvedResult = await result;

      expect(resolvedResult).toBeNull();
      // @ts-ignore: jest-fetch-mock
      expect(fetch.mock.calls.length).toBe(0);
    });
  });

  describe('hasStarted', () => {
    it('should return true when polling has started', () => {
      // @ts-ignore: jest-fetch-mock
      fetch.mockResponse(
        '<result><status>failure</status><creationTime>2018-03-31 14:48:19.000000</creationTime><regToken/><customerId>0</customerId></result>'
      );

      const getResultPoller = new GetResultPoller(getCode);
      const result = getResultPoller.startAsync();

      expect(getResultPoller.hasStarted()).toBe(true);
    });

    it('should return false when polling has not started', () => {
      const getResultPoller = new GetResultPoller(getCode);
      expect(getResultPoller.hasStarted()).toBe(false);
    });
  });
});
