import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner';

import {IsearchCardView} from '../../components/IsearchCardView';
import {IsearchCircleView} from '../../components/IsearchCircleView';
import {IsearchListView} from '../../components/IsearchListView';
import {IsearchTableView} from '../../components/IsearchTableView';

import './index.css';

const IsearchViewer = ({
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
}) => {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [callErr, setCallErr] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(async () => {
    let feedURL = '/clas-feeds/isearch/solr/';

    if (testURL != undefined) {
      feedURL = testURL;
      console.log('test feed');
    }

    if (type === 'depList') {
      feedURL = `${feedURL}q=deptids:${ids[0]}&rows=2000&wt=json`;
    } else {
      let asuriteIds = ids.join(' OR ');
      feedURL = `${feedURL}q=asuriteId:(${asuriteIds})&rows=300&wt=json`;
    }

    axios
      .get(feedURL)
      .then(response => {
        //console.log(response);
        let orderedProfileResults = response.data.response.docs;
        if (type === 'customList') {
          // order results and assign custom titles
          orderedProfileResults = ids.map((item, index) => {
            for (var i = 0; i < response.data.response.docs.length; i++) {
              if (item === response.data.response.docs[i].asuriteId) {
                console.log('---');
                console.log('Processing title for: ' + response.data.response.docs[i].asuriteId);
                // get the sourceID index to use for selecting the right title, sourceID would be the department this profile was selected from
                var titleIndex = -1;
                // some profiles don't have deptids ???
                if (response.data.response.docs[i].deptids != undefined) {
                  titleIndex = response.data.response.docs[i].deptids.indexOf(
                    sourceIds[index].toString()
                  );
                }
                // if there is no eid then use asurite in place
                if (response.data.response.docs[i].eid == undefined) {
                  response.data.response.docs[i].eid = response.data.response.docs[i].asuriteId;
                }
                // if there is no sourceID for this profile, then we should default to the workingTitle field
                if (titleIndex == -1) {
                  response.data.response.docs[i].selectedDepTitle =
                    response.data.response.docs[i].workingTitle;
                  console.log('No titleIndex, use working title');
                }
                // if there is a sourceID index, use it to select the correct title from the titles array
                else {
                  response.data.response.docs[i].selectedDepTitle =
                    response.data.response.docs[i].titles[titleIndex];
                  console.log('Set title via titleIndex');
                  // however! if the title source array indicates workingTitle, then use the workingTitle field instead of the department title in the title array
                  if (response.data.response.docs[i].titleSource[titleIndex] == 'workingTitle') {
                    response.data.response.docs[i].selectedDepTitle =
                      response.data.response.docs[i].workingTitle;
                    console.log('Title source override, use working title');
                  }
                }

                return response.data.response.docs[i];
              }
            }
          });
        } else {
          //assign custom titles and rank
          orderedProfileResults = orderedProfileResults.map(item => {
            let titleIndex = item.deptids.indexOf(ids[0].toString());
            item.selectedDepTitle = item.titles[titleIndex];
            //console.log(item.titles);
            if (item.titleSource[titleIndex] == 'workingTitle') {
              item.selectedDepTitle = item.workingTitle;
              //console.log('use working title')
            }
            if (sortType === 'rank') {
              item.selectedDepRank = item.employeeWeight[titleIndex];
            }
            return item;
          });

          // order filtered results
          orderedProfileResults = orderedProfileResults.filter(profile =>
            selectedFilters.includes(profile.primarySimplifiedEmplClass)
          );
          if (typeof titleFilter !== 'undefined') {
            if (titleFilter[0] === '/') {
              //console.log('its regex')
              const pattern = titleFilter.match(/\/(.*)\//).pop();
              const flags = titleFilter.substr(titleFilter.lastIndexOf('/') + 1);
              let regexConstructor = new RegExp(pattern, flags);
              orderedProfileResults = orderedProfileResults.filter(profile =>
                regexConstructor.test(profile.selectedDepTitle)
              );
            } else {
              //console.log('its a string')
              orderedProfileResults = orderedProfileResults.filter(
                profile => profile.selectedDepTitle === titleFilter
              );
            }
          }

          // sort results
          if (sortType === 'rank') {
            orderedProfileResults = orderedProfileResults.sort((a, b) => {
              if (a.selectedDepRank === b.selectedDepRank) {
                return a.lastName.localeCompare(b.lastName);
              } else {
                return a.selectedDepRank - b.selectedDepRank;
              }
            });
          } else {
            orderedProfileResults = orderedProfileResults.sort((a, b) =>
              a.lastName.localeCompare(b.lastName)
            );
          }
        }

        setData(orderedProfileResults);
        setLoaded(true);
        setCallErr(false);
      })
      .catch(error => {
        // API call error catching
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response);

          setLoaded(true);
          setCallErr(true);
          setErrMsg('Server responded with a status code of: ' + error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);

          setLoaded(true);
          setCallErr(true);
          setErrMsg('The request was made but no response was received.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        //display config info for error
        console.log(error.config);
      });
  });

  if (defaultPhoto == undefined) {
    defaultPhoto = '/profiles/openclas/modules/custom/clas_isearch/images/avatar.png';
  }

  data.map(node => {
    // Don't know why node would be undefined but sometimes it is
    if (node == undefined) {
      return null;
    }

    if (!loaded) {
      return (
        <div className="loader">
          <Loader type="ThreeDots" color="#5C6670" height="100" width="100" />
        </div>
      );
    }

    switch (displayType) {
      case 'circles':
        return (
          <IsearchCircleView
            key={node.eid}
            circleHover={circleHover}
            defaultPhoto={defaultPhoto}
            displayName={node.displayName}
            eid={node.eid}
            emailAddress={node.emailAddress}
            loaded={loaded}
            phone={node.phone}
            photoUrl={node.photoUrl}
            selectedDepTitle={node.selectedDepTitle}
            shortBio={node.shortBio}
          />
        );
        break;

      case 'cards':
        return (
          <IsearchCardView
            key={node.eid}
            defaultPhoto={defaultPhoto}
            displayName={node.displayName}
            eid={node.eid}
            emailAddress={node.emailAddress}
            loaded={loaded}
            phone={node.phone}
            photoUrl={node.photoUrl}
            selectedDepTitle={node.selectedDepTitle}
            shortBio={node.shortBio}
            showDescription={showDescription}
            showEmail={showEmail}
            showPhone={showPhone}
            showPhoto={showPhoto}
            showTitle={showTitle}
          />
        );
        break;

      case 'standard':
        return (
          <IsearchListView
            key={node.eid}
            defaultPhoto={defaultPhoto}
            displayName={node.displayName}
            eid={node.eid}
            emailAddress={node.emailAddress}
            loaded={loaded}
            phone={node.phone}
            photoUrl={node.photoUrl}
            selectedDepTitle={node.selectedDepTitle}
            shortBio={node.shortBio}
            showDescription={showDescription}
            showEmail={showEmail}
            showPhone={showPhone}
            showPhoto={showPhoto}
            showTitle={showTitle}
          />
        );
        break;

      default:
        return (
          <IsearchTableView
            key={node.eid}
            defaultPhoto={defaultPhoto}
            displayName={node.displayName}
            eid={node.eid}
            emailAddress={node.emailAddress}
            loaded={loaded}
            phone={node.phone}
            photoUrl={node.photoUrl}
            selectedDepTitle={node.selectedDepTitle}
            shortBio={node.shortBio}
            showDescription={showDescription}
            showEmail={showEmail}
            showPhone={showPhone}
            showPhoto={showPhoto}
            showTitle={showTitle}
          />
        );
    }
  });
};

IsearchViewer.propTypes = {
  /**
   * Enable circle profile with hover info
   */
  circleHover: PropTypes.bool,
  /**
   * String path to default photo
   */
  defaultPhoto: PropTypes.string,
  /**
   * iSearch profile Display Name
   */
  displayType: PropTypes.oneOf(['card', 'circle', 'standard', 'table']),
  /**
   * Array of ASURITE ids to query
   */
  ids: PropTypes.array,
  /**
   * Selected search filters
   */
  selectedFilters: PropTypes.string,
  /**
   * Display profile description?
   */
  showDescription: PropTypes.bool,
  /**
   * Display profile email?
   */
  showEmail: PropTypes.bool,
  /**
   * Display profile phone?
   */
  showPhone: PropTypes.bool,
  /**
   * Display profile photo?
   */
  showPhoto: PropTypes.bool,
  /**
   * Display profile title?
   */
  showTitle: PropTypes.bool,
  /**
   * Sort profiles
   */
  sortType: PropTypes.oneOf(['alpha', 'rank']),
  /**
   * Array of ids (for primary title) to display
   */
  sourceIds: PropTypes.array,
  /**
   * Test URL for querying iSearch API
   */
  testURL: PropTypes.string,
  /**
   * Title fitler string for search
   */
  titleFilter: PropTypes.string,
  /**
   * Type (?)
   */
  type: PropTypes.string,
};

IsearchViewer.defaultProps = {
  circleHover: true,
  defaultPhoto: '/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
  displayType: 'standard',
  ids: [],
  selectedFilters: '',
  showDescription: true,
  showEmail: true,
  showPhone: true,
  showPhoto: true,
  showTitle: true,
  sortType: 'alpha',
  sourceIds: [],
  testURL: 'https://cd8.lndo.site/clas-feeds/isearch/solr/',
  titleFilter: '',
  type: 'customList',
};

export default IsearchViewer;
