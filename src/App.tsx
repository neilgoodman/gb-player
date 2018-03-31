import React from 'react';
import { NavigationRouteConfigMap, StackNavigator } from 'react-navigation';
import styles from './appStyles';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import styleGuide from './styleGuide';

const STACK_NAVIGATOR_SCREENS: NavigationRouteConfigMap = {};

STACK_NAVIGATOR_SCREENS[HomeScreen.ROUTE] = {
  screen: HomeScreen,
};

STACK_NAVIGATOR_SCREENS[LoginScreen.ROUTE] = {
  screen: LoginScreen,
};

const STACK_NAVIGATOR_CONFIG = {
  initialRouteName: HomeScreen.ROUTE,
  navigationOptions: {
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: styleGuide.colors.white,
    title: 'GB Player',
  },
};

// tslint:disable-next-line:variable-name
const RootStack = StackNavigator(
  STACK_NAVIGATOR_SCREENS,
  STACK_NAVIGATOR_CONFIG
);

export default class App extends React.Component {
  public render() {
    return <RootStack />;
  }
}
