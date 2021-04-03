import React from 'react';
import ReactDOM from 'react-dom';
import IsearchViewer from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<IsearchViewer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
