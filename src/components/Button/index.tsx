import React from 'react';
import { RegisteredStyle } from 'react-native';
import ReactNativeButton from 'react-native-button';
import styles from './styles';

export interface IProps {
  style?: RegisteredStyle<any> | object;
  children?: string;
  onPress?: () => void;
}

export default class Button extends React.Component<IProps> {
  public onPress = () => {
    if (this.props.onPress) {
      this.props.onPress.call(undefined);
    }
  };

  public render() {
    const buttonStyles: [RegisteredStyle<any> | object] = [styles.button];

    if (this.props.style) {
      buttonStyles.push(this.props.style);
    }

    return (
      <ReactNativeButton style={buttonStyles} onPress={this.onPress}>
        {this.props.children}
      </ReactNativeButton>
    );
  }
}
