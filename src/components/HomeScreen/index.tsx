import React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import styles from './styles';

export interface IProps {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export default class HomeScreen extends React.Component<IProps, object> {
  public render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>hi hannah</Text>
      </View>
    );
  }
}
