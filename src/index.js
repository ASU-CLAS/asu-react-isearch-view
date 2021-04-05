import React from 'react';
import {render} from 'react-dom';

import IsearchViewer from './containers/IsearchViewer';

import './index.css';

let appRoots = document.getElementsByClassName('clas-isearch-view');

for (let element of appRoots) {
  const {
    circleHover,
    defaultPhoto,
    displayType,
    ids,
    selectedFilters,
    showPhoto,
    showTitle,
    showDescription,
    showEmail,
    showPhone,
    sortType,
    sourceIds,
    testURL,
    titleFilter,
    type,
  } = element;

  render(
    <IsearchViewer
      circleHover={circleHover}
      defaultPhoto={defaultPhoto}
      displayType={displayType}
      ids={ids}
      selectedFilters={selectedFilters}
      showPhoto={showPhoto}
      showTitle={showTitle}
      showDescription={showDescription}
      showEmail={showEmail}
      showPhone={showPhone}
      sortType={sortType}
      sourceIds={sourceIds}
      testURL={testURL}
      titleFilter={titleFilter}
      type={type}
    />,
    element
  );
}
