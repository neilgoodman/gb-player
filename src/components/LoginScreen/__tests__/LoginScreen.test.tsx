jest.mock('../../../lib/giant-bomb-api-client/auth');
jest.mock('../../../lib/AuthTokenStore');
jest.mock('Linking');

import React from 'react';
import { Linking } from 'react-native';
import renderer from 'react-test-renderer';
import LoginScreen from '../';
import AuthTokenStore from '../../../lib/AuthTokenStore';
import {
  Client,
  GetCode,
  GetResultPoller,
} from '../../../lib/giant-bomb-api-client/auth';
import HomeScreen from '../../HomeScreen';
import IScreenComponentProps from '../../IScreenComponentProps';

describe('LoginScreen', () => {
  let props: IScreenComponentProps;
  const TEST_REG_CODE = 'C12345';
  const getCode = {
    status: 'success',
    regCode: TEST_REG_CODE,
    retryInterval: 1,
    retryDuration: 1,
  };
  const TEST_REG_TOKEN = 'D12345';

  beforeEach(() => {
    // @ts-ignore: jest mock
    props = {
      navigation: {
        navigate: jest.fn(),
      },
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('render', () => {
    it('should render correctly when given all props', () => {
      const rendered = renderer
        .create(<LoginScreen navigation={props.navigation} />)
        .toJSON();

      expect(rendered).toMatchSnapshot();
    });

    it('should render correctly when state.hasLoaded and state.regCode are set', () => {
      const testRenderer = renderer.create(
        <LoginScreen navigation={props.navigation} />
      );

      const instance = testRenderer.getInstance();
      // @ts-ignore: test renderer
      instance.setState({
        hasLoaded: true,
        regCode: TEST_REG_CODE,
      });

      const rendered = testRenderer.toJSON();

      expect(rendered).toMatchSnapshot();
    });
  });

  describe('componentWillMount', () => {
    it('should update state with results from auth/Client.getCodeAsync', async () => {
      expect.assertions(3);

      const loginScreen = new LoginScreen(props);

      // @ts-ignore: jest mock
      loginScreen._client.getCodeAsync.mockResolvedValueOnce(getCode);
      loginScreen.setState = jest.fn();

      await loginScreen.componentWillMount();

      // @ts-ignore: jest mock
      const setStateCall = loginScreen.setState.mock.calls[0][0];

      expect(setStateCall.regCode).toBe(TEST_REG_CODE);
      expect(setStateCall.getResultPoller).toBeInstanceOf(GetResultPoller);
      expect(setStateCall.hasLoaded).toBe(true);
    });
  });

  describe('componentWillUnmount', () => {
    it('should call state.getResultPoller.stop if set', () => {
      const loginScreen = new LoginScreen(props);

      // @ts-ignore: jest mock
      loginScreen.state = {
        getResultPoller: {
          stop: jest.fn(),
        },
      };
      loginScreen.componentWillUnmount();

      // @ts-ignore: jest
      expect(loginScreen.state.getResultPoller.stop).toHaveBeenCalled();
    });

    it("should't throw an error if state.getResultPoller is not set", () => {
      const loginScreen = new LoginScreen(props);

      expect(() => loginScreen.componentWillUnmount()).not.toThrow();
    });
  });

  describe('componentDidUpdate', () => {
    it('should fetch the API key, store it, and navigate to HomeScreen if state.getResultPoller is set', async () => {
      expect.assertions(2);

      const loginScreen = new LoginScreen(props);

      // @ts-ignore: jest mock
      loginScreen.state = {
        getResultPoller: {
          hasStarted: jest.fn().mockReturnValueOnce(false),
          startAsync: jest
            .fn()
            .mockResolvedValueOnce({ regToken: TEST_REG_TOKEN }),
        },
      };

      // @ts-ignore: jest
      await loginScreen.componentDidUpdate(props, {});

      expect(AuthTokenStore.setAsync).toHaveBeenCalledWith(TEST_REG_TOKEN);
      expect(props.navigation.navigate).toHaveBeenCalledWith(HomeScreen.ROUTE);
    });

    it("shouldn't store API key and navigate to HomeScreen if regToken was null", async () => {
      expect.assertions(2);

      const loginScreen = new LoginScreen(props);

      // @ts-ignore: jest mock
      loginScreen.state = {
        getResultPoller: {
          hasStarted: jest.fn().mockReturnValueOnce(false),
          startAsync: jest.fn().mockResolvedValueOnce(null),
        },
      };

      // @ts-ignore: jest
      await loginScreen.componentDidUpdate(props, {});

      expect(AuthTokenStore.setAsync).not.toHaveBeenCalledWith(TEST_REG_TOKEN);
      expect(props.navigation.navigate).not.toHaveBeenCalledWith(
        HomeScreen.ROUTE
      );
    });

    it("shouldn't store API key and navigate to HomeScreen if getResultPoller hasStarted returns true", async () => {
      expect.assertions(2);

      const loginScreen = new LoginScreen(props);

      // @ts-ignore: jest mock
      loginScreen.state = {
        getResultPoller: {
          hasStarted: jest.fn().mockReturnValueOnce(true),
          startAsync: jest.fn().mockResolvedValueOnce(null),
        },
      };

      // @ts-ignore: jest
      await loginScreen.componentDidUpdate(props, {});

      expect(AuthTokenStore.setAsync).not.toHaveBeenCalledWith(TEST_REG_TOKEN);
      expect(props.navigation.navigate).not.toHaveBeenCalledWith(
        HomeScreen.ROUTE
      );
    });
  });

  describe('openGiantBombOnPress', () => {
    it('should deep link to the Giant Bomb login endpoint', () => {
      const loginScreen = new LoginScreen(props);

      loginScreen.openGiantBombOnPress();

      // @ts-ignore: jest mock
      expect(Linking.openURL.mock.calls[0][0]).toBe(
        'https://www.giantbomb.com/app/gb-player/activate'
      );
    });
  });
});
