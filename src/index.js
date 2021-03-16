import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import D8isearchPicker from './D8isearchView';
import IsearchProfileView from './IsearchProfileView';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

let appRoots = document.getElementsByClassName('clas-isearch-view');

for (let element of appRoots) {

  ReactDOM.render(
    <Router basename={"/"} forceRefresh={false}>
      <div>
        <Route exact path={"/"}>
          <D8isearchPicker dataFromPage={element.dataset} />
        </Route>
        <Route path={"/profiles/:eid"}>
          <IsearchProfileView dataFromPage={element.dataset} />
        </Route>
      </div>
    </Router>,
    element
  );

}
