import React from 'react';
import { StackNavigator } from 'react-navigation';
import styles from './appStyles';
import HomeScreen from './components/HomeScreen';

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      title: 'GB Player',
    },
  }
);

export default class App extends React.Component {
  public render() {
    return <RootStack />;
  }
}
