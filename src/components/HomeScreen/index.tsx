import React from 'react';
import { Text, View } from 'react-native';
import AuthTokenStore from '../../lib/AuthTokenStore';
import Button from '../Button';
import IScreenComponentProps from '../IScreenComponentProps';
import LoginScreen from '../LoginScreen';
import styles from './styles';

export interface IState {
  authToken?: string;
}

export default class HomeScreen extends React.Component<
  IScreenComponentProps,
  IState
> {
  public static ROUTE = 'HOME_SCREEN_ROUTE';

  constructor(props) {
    super(props);
    this.state = {
      authToken: '',
    };
  }

  public async componentDidMount() {
    const authToken = await AuthTokenStore.getAsync();

    this.setState({
      authToken,
    });

    if (authToken === '') {
      this.props.navigation.navigate(LoginScreen.ROUTE);
    }
  }

  public onPress = (): void => {
    AuthTokenStore.clearAsync();
  };

  public render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Home Screen {this.state.authToken}</Text>
        <Button onPress={this.onPress}>Clear Auth Token</Button>
      </View>
    );
  }
}
