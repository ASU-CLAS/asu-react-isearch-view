import React from 'react';
import ReactDOM from 'react-dom';
import IsearchDirectoryWrapperDrupal from './containers/IsearchDirectoryWrapperDrupal';

let appRoots = document.getElementsByClassName('clas-isearch-view');

for (let element of appRoots) {
  ReactDOM.render(<IsearchDirectoryWrapperDrupal dataFromPage={element.dataset} />, element);
}
