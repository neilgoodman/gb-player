import React from 'react';
import renderer from 'react-test-renderer';
import Button, { IProps } from '../';

describe('Button', () => {
  let props: IProps;

  beforeEach(() => {
    props = {
      children: 'test label',
      onPress: jest.fn(),
      style: {
        color: 'black',
      },
    };
  });

  describe('render', () => {
    it('should render correctly when given all props', () => {
      const rendered = renderer
        .create(
          <Button onPress={props.onPress} style={props.style}>
            {props.children}
          </Button>
        )
        .toJSON();

      expect(rendered).toMatchSnapshot();
    });

    it('should render correctly when given onPress prop', () => {
      const rendered = renderer
        .create(<Button onPress={props.onPress} />)
        .toJSON();
    });

    it('should render correctly when given style prop', () => {
      const rendered = renderer.create(<Button style={props.style} />).toJSON();
    });

    it('should render correctly when given style prop', () => {
      const rendered = renderer
        .create(<Button>{props.children}</Button>)
        .toJSON();
    });
  });

  describe('onPress', () => {
    it('should call props.onPress', () => {
      const button = new Button(props);

      button.onPress();

      expect(props.onPress).toHaveBeenCalled();
    });

    it('should not thrown an error if props.onPress is not given', () => {
      delete props.onPress;
      const button = new Button(props);

      expect(() => button.onPress()).not.toThrow();
    });
  });
});
