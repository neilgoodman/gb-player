import React from 'react';
import { Linking, Text, View } from 'react-native';
import AuthTokenStore from '../../lib/AuthTokenStore';
import { Client, GetResultPoller } from '../../lib/giant-bomb-api-client/auth';
import styleGuide from '../../styleGuide';
import Button from '../Button';
import HomeScreen from '../HomeScreen';
import IScreenComponentProps from '../IScreenComponentProps';
import styles from './styles';

export interface IState {
  loginEndpoint: string;
  hasLoaded: boolean;
  getResultPoller: GetResultPoller | null;
  regCode: string;
}

export default class LoginScreen extends React.Component<
  IScreenComponentProps,
  IState
> {
  public static ROUTE = 'LOGIN_SCREEN_ROUTE';
  private _client: Client;

  constructor(props: IScreenComponentProps) {
    super(props);
    this.state = {
      loginEndpoint: Client.LOGIN_ENDPOINT,
      hasLoaded: false,
      getResultPoller: null,
      regCode: '',
    };
    this._client = new Client();
  }

  public async componentWillMount() {
    const getCodeResult = await this._client.getCodeAsync();
    this.setState({
      regCode: getCodeResult.regCode,
      getResultPoller: new GetResultPoller(getCodeResult),
      hasLoaded: true,
    });
  }

  public componentWillUnmount() {
    const { getResultPoller } = this.state;

    if (getResultPoller) {
      getResultPoller.stop();
    }
  }

  public async componentDidUpdate(
    prevProps: IScreenComponentProps,
    prevState: IState
  ) {
    const { getResultPoller } = this.state;
    if (getResultPoller && !getResultPoller.hasStarted()) {
      const getResultResult = await getResultPoller.startAsync();

      if (getResultResult !== null) {
        await AuthTokenStore.setAsync(getResultResult.regToken);
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
