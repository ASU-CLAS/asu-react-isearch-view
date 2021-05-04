import React, { Component } from 'react';
import axios from 'axios';
import {IsearchTableView} from '../components/IsearchTableView';
import {IsearchTableList} from '../containers/IsearchTableList';
import {IsearchDefaultList} from '../containers/IsearchDefaultList';
import {IsearchCircleList} from '../containers/IsearchCircleList';
import {IsearchCardList} from '../containers/IsearchCardList';
import Loader from 'react-loader-spinner';
import PropTypes from 'prop-types';

class IsearchDirectoryWrapperDrupal extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      ourData: [],
      isLoaded: false,
      callErr: true,
      errMsg: '',
    };
  }

  componentDidMount() {

    const isearchConfig = JSON.parse(this.props.dataFromPage.config)

    let feedURL = isearchConfig.endpointURL

    // fallback for older CLAS CMS usage
    if(isearchConfig.endpointURL == undefined) {
      feedURL = '/clas-feeds/isearch/solr/'
    }

    // depList and customList need to use different solr queries
    if (isearchConfig.type === 'depList') {
      if ('deptList' === 1409) {
        feedURL = feedURL + 'q=deptids:' + isearchConfig.ids[0] + '&rows=2000&wt=json'
      } else {
        feedURL = feedURL + 'q=deptids:' + isearchConfig.ids[0] + '&rows=2000&wt=json'
      }
    }
    else {
      let asuriteIds = isearchConfig.ids.join(' OR ')
      feedURL = feedURL + 'q=asuriteId:('+ asuriteIds + ')&rows=300&wt=json'
    }

    axios.get(feedURL).then(response => {

      let orderedProfileResults = response.data.response.docs

      if (isearchConfig.type === 'customList') {
        // order results and assign custom titles
        orderedProfileResults = isearchConfig.ids.map(( item, index ) => {
          for (var i = 0; i < response.data.response.docs.length; i++) {
            if (item === response.data.response.docs[i].asuriteId) {
              console.log('---')
              console.log('Processing title for: ' + response.data.response.docs[i].asuriteId)
              // get the sourceID index to use for selecting the right title, sourceID would be the department this profile was selected from
              var titleIndex = -1;
              // some profiles don't have deptids ???
              if(response.data.response.docs[i].deptids != undefined) {
                titleIndex = response.data.response.docs[i].deptids.indexOf(isearchConfig.sourceIds[index].toString())
              }
              // if there is no eid then use asurite in place
              if(response.data.response.docs[i].eid == undefined) {
                response.data.response.docs[i].eid = response.data.response.docs[i].asuriteId
              }
              // if there is no sourceID for this profile, then we should default to the workingTitle field
              if(titleIndex == -1) {
                response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].workingTitle
                console.log('No titleIndex, use working title')
              }
              // if there is a sourceID index, use it to select the correct title from the titles array
              else {
                response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].titles[titleIndex]
                console.log('Set title via titleIndex')
                // however! if the title source array indicates workingTitle, then use the workingTitle field instead of the department title in the title array
                if(response.data.response.docs[i].titleSource[titleIndex] == 'workingTitle') {
                  response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].workingTitle
                  console.log('Title source override, use working title')
                }
              }

              return response.data.response.docs[i]
            }
          }
        })
      }
      else {
        //assign custom titles and rank
        orderedProfileResults = orderedProfileResults.map( item => {
          let titleIndex = item.deptids.indexOf(isearchConfig.ids[0].toString())
          item.selectedDepTitle = item.titles[titleIndex]
          //console.log(item.titles);
          if(item.titleSource[titleIndex] == 'workingTitle') {
            item.selectedDepTitle = item.workingTitle
            //console.log('use working title')
          }
          if (isearchConfig.sortType === 'rank') {
            item.selectedDepRank = item.employeeWeight[titleIndex]
          }
          return item
        })

        // filter results by employee type (selectedFilters)
        if (typeof isearchConfig.selectedFilters !== 'undefined') {
        orderedProfileResults = orderedProfileResults.filter( profile => isearchConfig.selectedFilters.includes(profile.primaryEmplClass))
        }

        // filter results by subaffilation type (subAffFilters)
         if (typeof isearchConfig.subAffFilters !== 'undefined') {
            orderedProfileResults = orderedProfileResults.filter( profile => isearchConfig.subAffFilters.includes(profile.subaffiliations))
          }

        // filter results by title (titleFilter)
        if (typeof isearchConfig.titleFilter !== 'undefined') {
          // check if the title filter is in regex format
          if (isearchConfig.titleFilter[0] === '/') {
            const pattern = isearchConfig.titleFilter.match(/\/(.*)\//).pop();
            const flags = isearchConfig.titleFilter.substr(isearchConfig.titleFilter.lastIndexOf('/') + 1 )
            let regexConstructor = new RegExp(pattern, flags);
            orderedProfileResults = orderedProfileResults.filter( profile => regexConstructor.test(profile.selectedDepTitle))
          }
          else{
            orderedProfileResults = orderedProfileResults.filter( profile => profile.selectedDepTitle === isearchConfig.titleFilter)
          }
        }

        // sort results by isearch weight/rank
        if (isearchConfig.sortType === 'rank') {
          orderedProfileResults = orderedProfileResults.sort((a, b) => {
              if ( a.selectedDepRank === b.selectedDepRank ){
                return a.lastName.localeCompare(b.lastName)
              }
              else {
                return a.selectedDepRank - b.selectedDepRank
              }
          })
        }
        // otherwise sort alpha
        else {
          orderedProfileResults = orderedProfileResults.sort((a, b) => a.lastName.localeCompare(b.lastName))
        }
      }

      this.setState({
        ourData: orderedProfileResults,
        isLoaded: true,
        callErr: false
      }, () => {
        //console.log(this.state.ourData);
      })
    }).catch((error) => {
        // API call error catching
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response);
            this.setState({
              isLoaded: true,
              callErr: true,
              errMsg: 'Server responded with a status code of: ' + error.response.status
            })

        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            this.setState({
              isLoaded: true,
              callErr: true,
              errMsg: 'The request was made but no response was received.'
            })
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        //display config info for error
        console.log(error.config);
    });
  }

  render() {

    let config = JSON.parse(this.props.dataFromPage.config);

    // check for missing config options and set defaults
    if(config.defaultPhoto == undefined) {
      config.defaultPhoto = "https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png";
    }
    if(config.showBio == undefined) { config.showBio = true; }
    if(config.showTitle == undefined) { config.showTitle = true; }
    if(config.showPhoto == undefined) { config.showPhoto = true; }
    if(config.showPhone == undefined) { config.showPhone = true; }
    if(config.showEmail == undefined) { config.showEmail = true; }

    let results = this.state.ourData.filter(Boolean);

    // loading animation
    if ( !this.state.isLoaded ) {
      return(
        <div className="loader">
          <Loader
           type="ThreeDots"
           color="#5C6670"
           height="100"
           width="100"
          />
        </div>
      )
    }
    else if (config.displayType === 'default') {
      return (
        <IsearchDefaultList profileList={results} listConfig={config} />
      );
    }
    else if (config.displayType === 'table' || config.displayType === 'classic') {
      return (
        <IsearchTableList profileList={results} listConfig={config} />
      );
    }
    else if (config.displayType === 'circles') {
      return (
        <IsearchCircleList profileList={results} listConfig={config} />
      );
    }
    else if (config.displayType === 'cards') {
      return (
        <IsearchCardList profileList={results} listConfig={config} />
      );
    }

  }
}

IsearchDirectoryWrapperDrupal.propTypes = {
  dataFromPage: PropTypes.object.isRequired,
  /*
  dataFromPage: PropTypes.shape({
    type: PropTypes.string.isRequired,
    defaultPhoto: PropTypes.string,
    endpointURL: PropTypes.string,
    displayType: PropTypes.string.isRequired,
    ids: PropTypes.array.isRequired,
    sourceIds: PropTypes.array,
    showPhoto: PropTypes.string,
    showTitle: PropTypes.string,
    showBio: PropTypes.string,
    showEmail: PropTypes.string,
    showPhone: PropTypes.string,
  }).isRequired,
  */
}

export default IsearchDirectoryWrapperDrupal;
