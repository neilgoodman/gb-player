import { StyleSheet } from 'react-native';
import styleGuide from '../../styleGuide';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleGuide.colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: styleGuide.colors.white,
  },
});
