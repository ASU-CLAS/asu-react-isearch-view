import React, { Component } from 'react';
import axios from 'axios';
import {IsearchTableView} from '../components/IsearchTableView';
import {IsearchTableList} from '../containers/IsearchTableList';
import {IsearchDefaultList} from '../containers/IsearchDefaultList';
import {IsearchCircleList} from '../containers/IsearchCircleList';
import {IsearchCardList} from '../containers/IsearchCardList';
import IsearchAtoZFilter from '../components/userFilters/IsearchAtoZFilter/index.js'
import Loader from 'react-loader-spinner';
import PropTypes from 'prop-types';
import EventEmitter from 'events';

class IsearchDirectoryWrapperDrupal extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      ourData: [],
      profileList: [],
      filterActive: false,
      filterLetter: '',
      isLoaded: false,
      callErr: true,
      errMsg: '',
    };
  }

  componentDidMount() {

    const isearchConfig = JSON.parse(this.props.dataFromPage.config)

    let feedURL = isearchConfig.endpointURL

    console.log('iSearch Viewer - 2.0.3')
    console.log('Developed by The College of Liberal Arts and Sciences')
    console.log('https://github.com/ASU-CLAS/asu-react-isearch-view')
    console.log('---')
    console.log(feedURL);

    // fallback for older CLAS CMS usage
    if(isearchConfig.endpointURL == undefined) {
      feedURL = '/clas-feeds/isearch/solr/'
    }

    // depList and customList need to use different solr queries
    if (isearchConfig.type === 'depList') {
      feedURL = feedURL + 'q=deptids:' + isearchConfig.ids[0] + '&rows=3000&wt=json'
    }
    else {
      let asuriteIds = isearchConfig.ids.join(' OR ')
      feedURL = feedURL + 'q=asuriteId:('+ asuriteIds + ')&rows=2000&wt=json'
    }

    axios.get(feedURL).then(response => {

      let orderedProfileResults = response.data.response.docs
      let subAffProfiles = []

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
                console.log(response.data.response.docs[i].workingTitle)
                // courtesy affiliates don't have workingTitle :( so just use the first title in the list
                if(response.data.response.docs[i].workingTitle == undefined) {
                  // check if the titles array exists and use that... can't take anything for granted
                  if(response.data.response.docs[i].titles != undefined && response.data.response.docs[i].titles[0] != undefined) {
                    response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].titles[0];
                  }
                  else {

                    console.log('No titleIndex, no titles array, no title?')
                    // if the titles array doesn't exist, they just don't get a title I guess...
                    response.data.response.docs[i].selectedDepTitle = '';

                    // unless they are a student? we can test for student affiliation and make up a title
                    if(response.data.response.docs[i].affiliations != undefined && response.data.response.docs[i].affiliations[0] == 'Student') {
                      console.log('Might be a student')
                      response.data.response.docs[i].selectedDepTitle = 'Student';
                      if(response.data.response.docs[i].careers != undefined) {
                        response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].careers[0];
                      }
                    }

                    // or maybe a courtesy affiliate?
                    if(response.data.response.docs[i].affiliations != undefined && response.data.response.docs[i].affiliations[0] == 'Courtesy Affiliate"') {
                      console.log('Is a courtesy affiliate')
                      // not sure what to do here now, could be anything!
                    }

                  }

                }
              }
              // if there is a sourceID index, use it to select the correct title from the titles array
              else {
                response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].titles[titleIndex]
                console.log('Set title via titleIndex')
                // however! if the title source array indicates workingTitle, then use the workingTitle field instead of the department title in the title array
                if(response.data.response.docs[i].titleSource[titleIndex] == 'workingTitle') {
                  console.log('Title source override, use working title')
                  // yes... sometime you see a profile indicate use workingTitle but there is no working workingTitle field
                  if(response.data.response.docs[i].workingTitle != undefined) {
                    response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].workingTitle
                  }
                  else {
                    console.log('They said use working title, but there is none!')
                  }


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

        // filter results by subaffilation type (subAffFilters)
        if (typeof isearchConfig.subAffFilters !== 'undefined') {

          subAffProfiles = response.data.response.docs
            .filter(profile => profile.subaffiliations !== undefined)
            .filter(profile => isearchConfig.subAffFilters.some(filter => profile.subaffiliations.includes(filter)))
        }

        // filter results by employee type (selectedFilters)
        if (typeof isearchConfig.selectedFilters !== 'undefined') {
        //console.log(orderedProfileResults, "i am chiken");
        // Emeritus profiles don't have primarySimplifiedEmplClass property as they are not technically employees, but all of them have "Courtesy Affiliate" affiliations
        orderedProfileResults = orderedProfileResults.filter( profile => isearchConfig.selectedFilters.includes(profile.primarySimplifiedEmplClass) || profile.affiliations.includes("Courtesy Affiliate") && isearchConfig.selectedFilters.includes("Emeritus") )
        //console.log(orderedProfileResults, "after filter")
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
            orderedProfileResults = orderedProfileResults.filter( profile => profile.selectedDepTitle.toLowerCase().includes(isearchConfig.titleFilter.toLowerCase()) )
          }
        }

        // filter results by expertise (expertiseFilter)
        if (typeof isearchConfig.expertiseFilter === 'string' && isearchConfig.expertiseFilter !== '') {
          // check if the expertisefilter is in regex format
          if (isearchConfig.expertiseFilter[0] === '/') {
            const pattern = isearchConfig.expertiseFilter.match(/\/(.*)\//).pop();
            const flags = isearchConfig.expertiseFilter.substr(isearchConfig.expertiseFilter.lastIndexOf('/') + 1 )
            let regexConstructor = new RegExp(pattern, flags);
            orderedProfileResults = orderedProfileResults.filter( profile => {
              if ( profile.expertiseAreas ) {
                let matches = profile.expertiseAreas.filter( exp => regexConstructor.test(exp) )
                return matches.length > 0
              }
            })
          }
          else {
            orderedProfileResults = orderedProfileResults.filter( profile => {
              if ( profile.expertiseAreas ) {
                let matches = profile.expertiseAreas.filter( exp => isearchConfig.expertiseFilter.toLowerCase().includes( exp.toLowerCase()) ) // logic reversed so .include filters correctly (e.g. searching for Aging should not return results for Bioimaging)
                return matches.length > 0
              }
            })
          }
        }

        // add subaffiliates to array before sorting
        if(subAffProfiles.length > 0) {
          orderedProfileResults.push(...subAffProfiles)
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
        profileList: orderedProfileResults,
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

  handleClick(element){

    // if user clicks the same letter twice, it undos the filter and repopulates display profiles array with orig data
    if (this.state.filterActive === true && this.state.filterLetter === element) {
      this.setState({
        ourData: this.state.profileList,
        filterActive: false,
        filterLetter: ''
      })
    }

    else {
      // filters through original data on each change, adds letter filter, and then sets results to display profiles array
      let filteredProfileResults = this.state.profileList.filter( profile => profile.lastName.toLowerCase().charAt(0) === element.toLowerCase())

      this.setState({
        ourData: filteredProfileResults,
        filterActive: true,
        filterLetter: element,
      })
    }
   // console.log(this.state.filterActive, "after test")

    event.preventDefault();
  }

  render() {

    let config = JSON.parse(this.props.dataFromPage.config);

    console.log(this.state.filterActive, "checking filter")
    // check for missing config options and set defaults
    if(config.defaultPhoto == undefined) {
      config.defaultPhoto = "https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png";
    }
    if(config.showBio == undefined) { config.showBio = true; }
    if(config.showTitle == undefined) { config.showTitle = true; }
    if(config.showPhoto == undefined) { config.showPhoto = true; }
    if(config.showPhone == undefined) { config.showPhone = true; }
    if(config.showEmail == undefined) { config.showEmail = true; }
    if(config.showExpertise == undefined) { config.showExpertise = true; }
    if(config.showFilterAZ == undefined) { config.showFilterAZ = false; }

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
        <div>
          {config.showFilterAZ == true &&
            <IsearchAtoZFilter selectedLetter={this.state.filterLetter} onClick={e => this.handleClick(e.target.id)}/>
          }
          <IsearchDefaultList profileList={results} listConfig={config} />
        </div>
      );
    }
    else if (config.displayType === 'table' || config.displayType === 'classic') {
      return (
        <div>
        {config.showFilterAZ == true &&
          <IsearchAtoZFilter selectedLetter={this.state.filterLetter} onClick={e => this.handleClick(e.target.id)}/>
        }
          <IsearchTableList profileList={results} listConfig={config} />
        </div>
      );
    }
    else if (config.displayType === 'circles') {
      return (
        <div>
        {config.showFilterAZ == true &&
          <IsearchAtoZFilter selectedLetter={this.state.filterLetter} onClick={e => this.handleClick(e.target.id)}/>
        }
          <IsearchCircleList profileList={results} listConfig={config} />
        </div>
      );
    }
    else if (config.displayType === 'cards') {
      return (
        <div>
        {config.showFilterAZ == true &&
          <IsearchAtoZFilter selectedLetter={this.state.filterLetter} onClick={e => this.handleClick(e.target.id)}/>
        }
          <IsearchCardList profileList={results} listConfig={config} />
        </div>
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
    showExpertise: PropTypes.string
  }).isRequired,
  */
}

export default IsearchDirectoryWrapperDrupal;
