import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import D8isearchPicker from './D8isearchView';

let appRoots = document.getElementsByClassName('clas-isearch-view');

for (let element of appRoots) {
  ReactDOM.render(<D8isearchPicker dataFromPage={element.dataset} />, element);
}
