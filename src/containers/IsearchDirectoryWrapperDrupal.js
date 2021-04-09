import React, { Component } from 'react';
import axios from 'axios';
import {IsearchTableView} from '../components/IsearchTableView';
import {IsearchTableList} from '../containers/IsearchTableList';
import {IsearchDefaultList} from '../containers/IsearchDefaultList';
import {IsearchCircleList} from '../containers/IsearchCircleList';
import Loader from 'react-loader-spinner';

class IsearchDirectoryWrapperDrupal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ourData: [],
      isLoaded: false,
      callErr: true,
      errMsg: '',
      displayType: 'classic',
      sortType: 'alpha',
    };
  }


  componentDidMount() {
    // const feedURL = this.props.dataFromPage.config
    //console.log(this.props.dataFromPage)
    const feedData = JSON.parse(this.props.dataFromPage.config)
    let feedURL = '/clas-feeds/isearch/solr/'

    if(feedData.testURL != undefined) {
      feedURL = feedData.testURL
      console.log('test feed')
    }

    if (feedData.type === 'depList') {
      feedURL = feedURL + 'q=deptids:' + feedData.ids[0] + '&rows=2000&wt=json'
    }
    else {
      let asuriteIds = feedData.ids.join(' OR ')
      feedURL = feedURL + 'q=asuriteId:('+ asuriteIds + ')&rows=300&wt=json'
    }



    axios.get(feedURL).then(response => {

      //console.log(response);
      let orderedProfileResults = response.data.response.docs
      if (feedData.type === 'customList') {
        // order results and assign custom titles
        orderedProfileResults = feedData.ids.map(( item, index ) => {
          for (var i = 0; i < response.data.response.docs.length; i++) {
            if (item === response.data.response.docs[i].asuriteId) {
              console.log('---')
              console.log('Processing title for: ' + response.data.response.docs[i].asuriteId)
              // get the sourceID index to use for selecting the right title, sourceID would be the department this profile was selected from
              var titleIndex = -1;
              // some profiles don't have deptids ???
              if(response.data.response.docs[i].deptids != undefined) {
                titleIndex = response.data.response.docs[i].deptids.indexOf(feedData.sourceIds[index].toString())
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
          let titleIndex = item.deptids.indexOf(feedData.ids[0].toString())
          item.selectedDepTitle = item.titles[titleIndex]
          //console.log(item.titles);
          if(item.titleSource[titleIndex] == 'workingTitle') {
            item.selectedDepTitle = item.workingTitle
            //console.log('use working title')
          }
          if (feedData.sortType === 'rank') {
            item.selectedDepRank = item.employeeWeight[titleIndex]
          }
          return item
        })

        // order filtered results
        orderedProfileResults = orderedProfileResults.filter( profile => feedData.selectedFilters.includes(profile.primarySimplifiedEmplClass))
        if (typeof feedData.titleFilter !== 'undefined') {
          if (feedData.titleFilter[0] === '/') {
            //console.log('its regex')
            const pattern = feedData.titleFilter.match(/\/(.*)\//).pop();
            const flags = feedData.titleFilter.substr(feedData.titleFilter.lastIndexOf('/') + 1 )
            let regexConstructor = new RegExp(pattern, flags);
            orderedProfileResults = orderedProfileResults.filter( profile => regexConstructor.test(profile.selectedDepTitle))
          }
          else{
            //console.log('its a string')
            orderedProfileResults = orderedProfileResults.filter( profile => profile.selectedDepTitle === feedData.titleFilter)
          }
        }

        // sort results
        if (feedData.sortType === 'rank') {
          orderedProfileResults = orderedProfileResults.sort((a, b) => {
              if ( a.selectedDepRank === b.selectedDepRank ){
                return a.lastName.localeCompare(b.lastName)
              }
              else {
                return a.selectedDepRank - b.selectedDepRank
              }
          })
        }
        else {
          orderedProfileResults = orderedProfileResults.sort((a, b) => a.lastName.localeCompare(b.lastName))
        }
      }


      this.setState({
        ourData: orderedProfileResults,
        isLoaded: true,
        callErr: false,
        displayType: feedData.displayType
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

  // circles -> Circle View
  // cards -> Card View
  // default -> Table View
  render() {
    console.log("Display type is "+this.state.displayType+"... ");

    let config = JSON.parse(this.props.dataFromPage.config);
    if(config.defaultPhoto == undefined) {
      config.defaultPhoto = "/profiles/openclas/modules/custom/clas_isearch/images/avatar.png";
    }
    let results = this.state.ourData.filter(Boolean);;

    console.log("-- v config v --");
    console.log(config);
    console.log("-- v results v --");
    console.log(results);

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
    else if (this.state.displayType === 'default') {
      return (
        <IsearchDefaultList profileList={results} listConfig={config} />
      );
    }
    else if (this.state.displayType === 'table' || this.state.displayType === 'classic') {
      console.log("Rendering "+this.state.displayType+"... ");
      console.log(results);
      return (
        <IsearchTableList profileList={results} listConfig={config} />
      );
    }
    else if (this.state.displayType === 'circles' || this.state.displayType === 'cards') {
      return (
        <IsearchCircleList profileList={results} listConfig={config} />
      );
    }

  }
}

export default IsearchDirectoryWrapperDrupal;
