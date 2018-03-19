import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  public render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const backgroundColor = '#fff';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
