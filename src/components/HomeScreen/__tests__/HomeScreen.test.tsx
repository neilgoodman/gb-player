jest.mock('../../../lib/AuthTokenStore');

import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../';
import AuthTokenStore from '../../../lib/AuthTokenStore';
import IScreenComponentProps from '../../IScreenComponentProps';
import LoginScreen from '../../LoginScreen';

describe('HomeScreen', () => {
  let props: IScreenComponentProps;
  const TEST_API_KEY = 'A1234';

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
        .create(<HomeScreen navigation={props.navigation} />)
        .toJSON();

      expect(rendered).toMatchSnapshot();
    });

    it('should render correctly when authToken is given', () => {
      const testRenderer = renderer.create(
        <HomeScreen navigation={props.navigation} />
      );

      const instance = testRenderer.getInstance();
      // @ts-ignore: test renderer
      instance.setState({ authToken: TEST_API_KEY });

      const rendered = testRenderer.toJSON();

      expect(rendered).toMatchSnapshot();
    });

    describe('componentDidMount', () => {
      it('should set the API key from AuthTokenStore if available', async () => {
        expect.assertions(1);

        const homeScreen = new HomeScreen(props);

        homeScreen.setState = jest.fn();
        // @ts-ignore: jest mock
        AuthTokenStore.getAsync.mockResolvedValueOnce(TEST_API_KEY);

        await homeScreen.componentDidMount();

        expect(homeScreen.setState).toHaveBeenCalledWith({
          authToken: TEST_API_KEY,
        });
      });

      it("should navigate to the LoginScreen if the API key isn't available", async () => {
        expect.assertions(1);

        const homeScreen = new HomeScreen(props);

        // @ts-ignore: jest mock
        AuthTokenStore.getAsync.mockResolvedValueOnce('');

        await homeScreen.componentDidMount();

        expect(props.navigation.navigate).toHaveBeenCalledWith(
          LoginScreen.ROUTE
        );
      });
    });

    describe('onPress', () => {
      it('should clear the API key', () => {
        const homeScreen = new HomeScreen(props);

        homeScreen.onPress();

        expect(AuthTokenStore.clearAsync).toHaveBeenCalled();
      });
    });
  });
});
