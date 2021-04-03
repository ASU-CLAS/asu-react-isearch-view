import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import IsearchViewer from './containers/IsearchViewer';

let appRoots = document.getElementsByClassName('clas-isearch-view');

for (let element of appRoots) {
  ReactDOM.render(<IsearchViewer dataFromPage={element.dataset} />, element);
}
