import { StyleSheet } from 'react-native';
import styleGuide from '../../styleGuide';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleGuide.colors.secondaryBackground,
    paddingTop: 40,
    paddingRight: 20,
    paddingLeft: 20,
  },
  text: {
    fontSize: 16,
    color: styleGuide.colors.white,
    marginBottom: 20,
  },
});
