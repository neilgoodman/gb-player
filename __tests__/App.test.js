import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

describe('App', () => {
  describe('render', () => {
    it('should render without crashing', () => {
      const rendered = renderer.create(<App />).toJSON();
      expect(rendered).toBeTruthy();
    });
  });
});
