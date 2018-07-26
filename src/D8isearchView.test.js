import React from 'react';
import ReactDOM from 'react-dom';
import D8isearchPicker from './D8isearchPicker';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<D8isearchPicker />, div);
  ReactDOM.unmountComponentAtNode(div);
});
