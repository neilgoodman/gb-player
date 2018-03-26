import React from 'react';
import { Linking, Text, View } from 'react-native';
import AuthToken from '../../lib/AuthToken';
import {
  AuthenticationPoller,
  Authenticator,
} from '../../lib/giant-bomb-api-client/auth';
import styleGuide from '../../styleGuide';
import Button from '../Button';
import HomeScreen from '../HomeScreen';
import IScreenComponentProps from '../IScreenComponentProps';
import styles from './styles';

export interface IState {
  loginEndpoint: string;
  hasLoaded: boolean;
  authenticationPoller: AuthenticationPoller | null;
  regCode: string;
}

export default class LoginScreen extends React.Component<
  IScreenComponentProps,
  IState
> {
  public static ROUTE = 'LOGIN_SCREEN_ROUTE';

  constructor(props: IScreenComponentProps) {
    super(props);
    this.state = {
      loginEndpoint: Authenticator.getLoginEndpoint(),
      hasLoaded: false,
      authenticationPoller: null,
      regCode: '',
    };
  }

  public async componentWillMount() {
    const getCodeResult = await Authenticator.getCodeAsync();
    this.setState({
      regCode: getCodeResult.regCode,
      authenticationPoller: new AuthenticationPoller(getCodeResult),
      hasLoaded: true,
    });
  }

  public componentWillUnmount() {
    const { authenticationPoller } = this.state;

    if (authenticationPoller) {
      authenticationPoller.stop();
    }
  }

  public async componentDidUpdate(
    prevProps: IScreenComponentProps,
    prevState: IState
  ) {
    const { authenticationPoller } = this.state;
    if (authenticationPoller && !authenticationPoller.hasStarted()) {
      const getResultResult = await authenticationPoller.startAsync();

      if (getResultResult !== null) {
        await AuthToken.setAsync(getResultResult.regToken);
        this.props.navigation.navigate(HomeScreen.ROUTE);
      }
    }
  }

  public openGiantBombOnPress = () => {
    Linking.openURL(this.state.loginEndpoint);
  };

  public render() {
    return <View style={styles.container}>{this._renderLoginDetails()}</View>;
  }

  private _renderLoginDetails(): JSX.Element | null {
    const { loginEndpoint, hasLoaded, regCode } = this.state;

    if (!hasLoaded) {
      return null;
    }

    return (
      <View>
        <Text style={styles.text}>
          Visit {loginEndpoint} and enter the code below to login.
        </Text>
        <Text style={styles.text}>{regCode}</Text>
        <Button onPress={this.openGiantBombOnPress}>Go to Giant Bomb</Button>
      </View>
    );
  }
}
