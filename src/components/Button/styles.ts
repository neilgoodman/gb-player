import { Dimensions, StyleSheet } from 'react-native';
import styleGuide from '../../styleGuide';

const { width: windowWidth } = Dimensions.get('window');

export default StyleSheet.create({
  button: {
    width: windowWidth - 40,
    backgroundColor: styleGuide.colors.tertiaryBackground,
    color: styleGuide.colors.white,
    marginBottom: 40,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
