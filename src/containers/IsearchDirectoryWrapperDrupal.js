import React, { Component } from 'react'
import axios from 'axios'
import {IsearchTableView} from '../components/IsearchTableView'
import {IsearchTableList} from '../containers/IsearchTableList'
import {IsearchDefaultList} from '../containers/IsearchDefaultList'
import {IsearchCircleList} from '../containers/IsearchCircleList'
import {IsearchCardList} from '../containers/IsearchCardList'
import IsearchAtoZFilter from '../components/userFilters/IsearchAtoZFilter'
import IsearchExpertiseFilter from '../components/userFilters/IsearchExpertiseFilter'
import IsearchTitleFilter from '../components/userFilters/IsearchTitleFilter'
import Avatar from "../components/images/avatar.png"
import Loader from 'react-loader-spinner'
import PropTypes from 'prop-types'
import EventEmitter from 'events'

class IsearchDirectoryWrapperDrupal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ourData: [],
      profileList: [],
      userAZFilterActive: false,
      filterLetter: '',
      userSelectTitleFilterOptions: [],
      userSelectTitleFilterActive: false,
      userSelectExpertiseFilterOptions: [],
      userSelectExpertiseFilterActive: false,
      expertiseSelectedOption: null,
      titleSelectedOption: null,
      isLoaded: false,
      callErr: true,
      errMsg: '',
    };
  }

  /* Title filter functions */

  getTitleOptions(profiles) {
    let titleOptionList = []
    profiles.forEach(profile => {
      if (profile.primaryTitle !== undefined) {
        titleOptionList.push({value: profile.primaryTitle, label: profile.primaryTitle})
      }
    })
    let filteredTitleOptionList = titleOptionList.filter((v,i,a)=>a.findIndex(t=>(t.label === v.label && t.value===v.value))===i)
    filteredTitleOptionList.sort((a, b) => a.value.localeCompare(b.value))
    this.setState({userSelectTitleFilterOptions: filteredTitleOptionList}) 
  }

  titleHandleChange = (selectedOption) => {
    this.setState({ titleSelectedOption: selectedOption }, () =>
      console.log(`Option selected:`, this.state.titleSelectedOption)
    );

    let filteredProfileResults = []
    let profileList = this.state.profileList

    if(selectedOption.length === 0){
      this.setTitleFilterState(profileList)
      this.setTitleFilterActiveState(false)
    } else { 
      selectedOption.forEach(option => {
        profileList.forEach(profile => {
          if(profile.primaryTitle === option.value){
            filteredProfileResults.push(profile)
          }
        })
      })
      this.setTitleFilterActiveState(true)
      this.setTitleFilterState(filteredProfileResults);
    }
  };

  setTitleFilterState = (filteredData) => {
    this.setState({
      ourData: filteredData
    })
  }

  checkFilterStatusTitle(){
    if(this.state.userAZFilterActive === true){
      this.clearAZFilter()
    }
    if(this.state.userSelectExpertiseFilterActive === true){
      this.clearExpertiseFilter()
    }
  }

  setTitleFilterActiveState = (bool) => {
    this.setState({userSelectTitleFilterActive: bool})
    this.checkFilterStatusTitle()
  }

  clearTitleFilter(){
    this.value = null
    this.setState({titleSelectedOption: null})
  }

/* Expertise filter functions */

  getExpertiseOptions(profiles) {
    let expertiseOptionList = []
    profiles.forEach(profile => {
      if (profile.expertiseAreas !== undefined) {
        profile.expertiseAreas.forEach(area => {
          expertiseOptionList.push({value: area, label: area})
        })
      }
    })
    let filteredExpertiseOptionList = expertiseOptionList.filter((v,i,a)=>a.findIndex(t=>(t.label === v.label && t.value===v.value))===i).sort()
    filteredExpertiseOptionList.sort((a, b) => a.value.localeCompare(b.value))
    this.setState({userSelectExpertiseFilterOptions: filteredExpertiseOptionList}) 
  }

  setExpertiseFilterState = (filteredData) => {
    this.setState({
      ourData: filteredData
    })
  }

  expertiseHandleChange = (selectedOption) => {
    this.setState({ expertiseSelectedOption: selectedOption }, () =>
      console.log(`Option selected:`, this.state.expertiseSelectedOption)
    );

    let filteredProfileResults = []
    let profileList = this.state.profileList

    if(selectedOption.length === 0){
      this.setExpertiseFilterState(profileList)
      this.setExpertiseFilterActiveState(false)
    } else {
      selectedOption.forEach(option => {
        profileList.forEach(profile => {
          if (profile.expertiseAreas !== undefined) {
            profile.expertiseAreas.forEach(area => {
              if(area === option.value){
                filteredProfileResults.push(profile)
              }
            })
          }
        })
      })
      this.setExpertiseFilterActiveState(true)
      this.setExpertiseFilterState(filteredProfileResults);
    }    
  };
  checkFilterStatusExpertise(){
    if(this.state.userAZFilterActive === true){
      this.clearAZFilter()
    }
    if(this.state.userSelectTitleFilterActive === true){
      this.clearTitleFilter()
    }
  }

  setExpertiseFilterActiveState = (bool) => {
    this.setState({userSelectExpertiseFilterActive: bool})
    this.checkFilterStatusExpertise()
  }

  clearExpertiseFilter(){
    this.value = null
    this.setState({expertiseSelectedOption: null})
  }

/* A-Z filter functions */

  checkFilterStatusAZ(){
    if(this.state.userSelectExpertiseFilterActive === true){
      this.clearExpertiseFilter()
    }
    if(this.state.userSelectTitleFilterActive === true){
      this.clearTitleFilter()
    }
  }
  clearAZFilter(){
    IsearchAtoZFilter.value = null
    this.setState({userAZFilterActive: false, filterLetter: ''})
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
                // courtesy affiliates don't have workingTitle :( so just use the first title in the list
                if(response.data.response.docs[i].workingTitle == undefined) {
                  // check if the titles array exists and use that... can't take anything for granted
                  if(response.data.response.docs[i].titles != undefined && response.data.response.docs[i].titles[0] != undefined) {
                    response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].titles[0];
                  }
                  else {
                    // if the titles array doesn't exist, they just don't get a title I guess...
                    response.data.response.docs[i].selectedDepTitle = '';

                    // unless they are a student? we can test for student affiliation and make up a title
                    if(response.data.response.docs[i].affiliations != undefined && response.data.response.docs[i].affiliations[0] == 'Student') {
                      response.data.response.docs[i].selectedDepTitle = 'Student';
                      if(response.data.response.docs[i].careers != undefined) {
                        response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].careers[0];
                      }
                    }

                    // or maybe a courtesy affiliate?
                    if(response.data.response.docs[i].affiliations != undefined && response.data.response.docs[i].affiliations[0] == 'Courtesy Affiliate"') {
                      // not sure what to do here now, could be anything!
                    }

                  }

                }
              }
              // if there is a sourceID index, use it to select the correct title from the titles array
              else {
                response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].titles[titleIndex]
                // however! if the title source array indicates workingTitle, then use the workingTitle field instead of the department title in the title array
                if(response.data.response.docs[i].titleSource[titleIndex] == 'workingTitle') {
                  // yes... sometime you see a profile indicate use workingTitle but there is no working workingTitle field
                  if(response.data.response.docs[i].workingTitle != undefined) {
                    response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].workingTitle
                  }
                  else {
                    
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
          if(item.titleSource[titleIndex] == 'workingTitle') {
            item.selectedDepTitle = item.workingTitle
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
        // Emeritus profiles don't have primarySimplifiedEmplClass property as they are not technically employees, but all of them have "Courtesy Affiliate" affiliations
        orderedProfileResults = orderedProfileResults.filter( profile => isearchConfig.selectedFilters.includes(profile.primarySimplifiedEmplClass) || profile.affiliations.includes("Courtesy Affiliate") && isearchConfig.selectedFilters.includes("Emeritus") )
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
      if(isearchConfig.showUserTitleFilter){

      }
      if(isearchConfig.showUserExpertiseFilter){

      }
      this.getTitleOptions(orderedProfileResults)
      this.getExpertiseOptions(orderedProfileResults)

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
    if (this.state.userAZFilterActive === true && this.state.filterLetter === element) {
      this.setState({
        ourData: this.state.profileList,
        userAZFilterActive: false,
        filterLetter: ''
      })
    }

    else {
      // filters through original data on each change, adds letter filter, and then sets results to display profiles array
      let filteredProfileResults = this.state.profileList.filter( profile => profile.lastName.toLowerCase().charAt(0) === element.toLowerCase())

      this.setState({
        ourData: filteredProfileResults,
        userAZFilterActive: true,
        filterLetter: element,
      })
    }
   // console.log(this.state.filterActive, "after test")
   
    event.preventDefault();
    this.clearExpertiseFilter()
    this.clearTitleFilter()
  }

  render() {

    let config = JSON.parse(this.props.dataFromPage.config);

    // check for missing config options and set defaults
    if(config.defaultPhoto == undefined) {
      config.defaultPhoto = Avatar;
    }
    if(config.showBio == undefined) { config.showBio = true; }
    if(config.showTitle == undefined) { config.showTitle = true; }
    if(config.showPhoto == undefined) { config.showPhoto = true; }
    if(config.showPhone == undefined) { config.showPhone = true; }
    if(config.showEmail == undefined) { config.showEmail = true; }
    if(config.showExpertise == undefined) { config.showExpertise = true; }
    if(config.showFilterAZ == undefined) { config.showFilterAZ = false; }
    if(config.showUserExpertiseFilter == undefined) { config.showUserExpertiseFilter = false; }
    if(config.showUserTitleFilter == undefined) { config.showUserTitleFilter = false; }

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
            <IsearchAtoZFilter 
            selectedLetter={this.state.filterLetter} 
            onClick={e => this.handleClick(e.target.id)}
            />
          }
        {config.showUserExpertiseFilter == true &&
        <div>
          <IsearchExpertiseFilter 
            options={this.state.userSelectExpertiseFilterOptions} 
            profileList={this.state.profileList}
            expertiseHandleChange={this.expertiseHandleChange} 
            expertiseSelectedOption={this.state.expertiseSelectedOption}
          />
        </div>
        }
        {config.showUserTitleFilter == true &&
        <div>
          <IsearchTitleFilter 
            options={this.state.userSelectTitleFilterOptions} 
            profileList={this.state.profileList} 
            titleHandleChange={this.titleHandleChange}
            titleSelectedOption={this.state.titleSelectedOption}
          />
        </div>
        }
          <IsearchDefaultList profileList={results} listConfig={config} />
        </div>
      );
    }
    else if (config.displayType === 'table' || config.displayType === 'classic') {
      return (
        <div>
        {config.showFilterAZ == true &&
          <IsearchAtoZFilter 
          selectedLetter={this.state.filterLetter} 
          onClick={e => this.handleClick(e.target.id)}
          />
        }
        {config.showUserExpertiseFilter == true &&
        <div>
          <IsearchExpertiseFilter 
            options={this.state.userSelectExpertiseFilterOptions} 
            profileList={this.state.profileList}
            expertiseHandleChange={this.expertiseHandleChange} 
            expertiseSelectedOption={this.state.expertiseSelectedOption}
          />
        </div>
        }
        {config.showUserTitleFilter == true &&
        <div>
          <IsearchTitleFilter 
            options={this.state.userSelectTitleFilterOptions} 
            profileList={this.state.profileList} 
            titleHandleChange={this.titleHandleChange}
            titleSelectedOption={this.state.titleSelectedOption}
          />
        </div>
        }
          <IsearchTableList profileList={results} listConfig={config} />
        </div>
      );
    }
    else if (config.displayType === 'circles') {
      return (
        <div>
        {config.showFilterAZ == true &&
        <div>
          <IsearchAtoZFilter 
            selectedLetter={this.state.filterLetter} 
            onClick={e => this.handleClick(e.target.id)}
          />
        </div>
        }
        {config.showUserExpertiseFilter == true &&
        <div>
          <IsearchExpertiseFilter 
            options={this.state.userSelectExpertiseFilterOptions} 
            profileList={this.state.profileList}
            expertiseHandleChange={this.expertiseHandleChange} 
            expertiseSelectedOption={this.state.expertiseSelectedOption}
          />
        </div>
        }
        {config.showUserTitleFilter == true &&
        <div>
          <IsearchTitleFilter 
            options={this.state.userSelectTitleFilterOptions} 
            profileList={this.state.profileList} 
            titleHandleChange={this.titleHandleChange}
            titleSelectedOption={this.state.titleSelectedOption}
          />
        </div>
        }
          <IsearchCircleList profileList={results} listConfig={config} />
        </div>
      );
    }
    else if (config.displayType === 'cards') {
      return (
        <div>
        {config.showFilterAZ == true &&
          <IsearchAtoZFilter 
          selectedLetter={this.state.filterLetter} 
          onClick={e => this.handleClick(e.target.id)}
          />
        }
                {config.showUserExpertiseFilter == true &&
        <div>
          <IsearchExpertiseFilter 
            options={this.state.userSelectExpertiseFilterOptions} 
            profileList={this.state.profileList}
            expertiseHandleChange={this.expertiseHandleChange} 
            expertiseSelectedOption={this.state.expertiseSelectedOption}
          />
        </div>
        }
        {config.showUserTitleFilter == true &&
        <div>
          <IsearchTitleFilter 
            options={this.state.userSelectTitleFilterOptions} 
            profileList={this.state.profileList} 
            titleHandleChange={this.titleHandleChange}
            titleSelectedOption={this.state.titleSelectedOption}
          />
        </div>
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
