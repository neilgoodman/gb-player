import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../../components/HomeScreen';
import IScreenComponentProps from '../../components/IScreenComponentProps';

describe('HomeScreen', () => {
  let props: IScreenComponentProps;

  beforeEach(() => {
    // @ts-ignore: jest mock
    props = {
      navigation: {
        navigate: jest.fn(),
      },
    };
  });

  describe('render', () => {
    it('should render correctly when given all props', () => {
      const rendered = renderer
        .create(<HomeScreen navigation={props.navigation} />)
        .toJSON();

      expect(rendered).toMatchSnapshot();
    });
  });
});
