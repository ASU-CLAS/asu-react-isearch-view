import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import './D8isearchView.css';
import Loader from 'react-loader-spinner';
// import Fade from 'react-reveal/Fade'; Todo: allow for multiple fade instances

class D8isearchPicker extends Component {

  state = {
    ourData: [],
    isLoaded: false,
    callErr: true,
    errMsg: '',
    displayType: 'classic',
    sortType: 'alpha',
  };

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
    console.log("Rendering "+this.state.displayType+"... ");
    let config = JSON.parse(this.props.dataFromPage.config);
    if(config.defaultPhoto == undefined) {
      config.defaultPhoto = "/profiles/openclas/modules/custom/clas_isearch/images/avatar.png";
    }
    let results = this.state.ourData.map(( thisNode, index ) => {
      // Don't know why thisNode would be undefined but sometimes it is
      if(thisNode == undefined) {
        return null;
      }
      switch (this.state.displayType) {
        case 'circles':
        return(
          <Col sm="3" key={thisNode.eid} className="modernCol">
          {(config.circlesOptionHover) ?
              <div class="ch-item ch-img-1" data-toggle="modal" data-target={".bd-isearch-modal-"+thisNode.eid} style={{backgroundImage: 'url(' + thisNode.photoUrl + '), url('+config.defaultPhoto+')'}}>
                <div class="ch-info-wrap">
                  <div class="ch-info">
                    <div class="ch-info-front ch-img-1"></div>
                    <div class="ch-info-back">
                      <h3>{thisNode.displayName}</h3>
                      <p>{thisNode.selectedDepTitle}</p>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div>
                <div className="modernProfile">
                  <img src={thisNode.photoUrl} data-toggle="modal" data-target={".bd-isearch-modal-"+thisNode.eid} onError={(e)=>{e.target.src=config.defaultPhoto}} alt={ 'profile picture for ' + thisNode.displayName } />
                </div>
                <div style={{textAlign: 'center'}}>
                  <a className="" href={ 'https://isearch.asu.edu/profile/' + thisNode.eid }>{thisNode.displayName}</a>
                  <p className="">{thisNode.selectedDepTitle}</p>
                </div>
              </div>
          }

              <div class={"modal fade bd-isearch-modal-"+thisNode.eid} tabindex="-1" role="dialog">
                <div class="modal-dialog isearch-card-modal">
                  <div class="modal-content">
                    <div class="card isearch-card">
                      <button type="button" class="close x" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">×</span>
                      </button>
                        <img class="pictureModal" src={thisNode.photoUrl} onError={(e)=>{e.target.src=config.defaultPhoto}} alt={ 'profile picture for ' + thisNode.displayName } />
                        <div class="card-body">
                          <h5 class="card-title">
                            <a className="linkOriginal" href={ 'https://isearch.asu.edu/profile/' + thisNode.eid }>{thisNode.displayName}</a>
                          </h5>
                          <h6 class="card-subtitle mb-2 text-muted titleOriginal">{thisNode.selectedDepTitle}</h6>
                          <p>{thisNode.shortBio}</p>
                          <p>
                            <a className="linkOriginal" href={ 'mailto:' + thisNode.emailAddress }>{thisNode.emailAddress}</a>
                          </p>
                          <p>{thisNode.phone}</p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          )
          break;
        case 'cards':
        return(
            <Col sm="3" key={thisNode.eid}>
              <div class="card isearch-card">
                  {(config.cardsOptionPhoto) ?
                    null :
                    <img class="card-img-top" src={thisNode.photoUrl} onError={(e)=>{e.target.src=config.defaultPhoto}} alt={ 'profile picture for ' + thisNode.displayName } />
                  }
                  <div class="card-header">
                    <h3 class="card-title">
                      <a className="" href={ 'https://isearch.asu.edu/profile/' + thisNode.eid }>{thisNode.displayName}</a>
                    </h3>
                  </div>
                  <div class="card-body">
                    { (config.cardsOptionTitle) ? null :
                      <h6 class="card-subtitle mb-2 text-muted titleOriginal">{thisNode.selectedDepTitle}</h6>
                    }
                    {(config.cardsOptionDescription) ? null :
                      <p>{thisNode.shortBio}</p>
                    }
                    <p>
                    {(config.cardsOptionEmail) ? null : <a className="linkOriginal" href={ 'mailto:' + thisNode.emailAddress }>{thisNode.emailAddress}</a>}
                    </p>
                    <p>
                    {(config.cardsOptionPhone) ? null : thisNode.phone }
                    </p>
                  </div>
              </div>
            </Col>
          )
          break;
        default:
        return(
            <tr key={thisNode.eid}>
              <th scope="row">
                {(config.classicOptionPhoto) ?
                  null :
                  <a href={ 'https://isearch.asu.edu/profile/' + thisNode.eid }>
                    <img className="pictureOriginal" src={thisNode.photoUrl} onError={(e)=>{e.target.src=config.defaultPhoto}} alt={ 'profile picture for ' + thisNode.displayName } />
                    </a>
                  }
              </th>
              <td>
                <h3 className="card-title">
                  <a href={ 'https://isearch.asu.edu/profile/' + thisNode.eid }>{thisNode.displayName}</a>
                </h3>
                { (config.classicOptionTitle) ? null : <p className="titleOriginal">{thisNode.selectedDepTitle}</p> }
                <p>
                  {(config.classicOptionDescription) ? null : thisNode.shortBio}
                </p>
              </td>
              <td>
                <p>
                  {(config.classicOptionEmail) ? null : <a className="linkOriginal" href={ 'mailto:' + thisNode.emailAddress }>{thisNode.emailAddress}</a>}
                </p>
                <p>
                  {(config.classicOptionPhone) ? null : thisNode.phone }
                </p>
              </td>
            </tr>
          )

      }

    })

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
    else if (this.state.displayType === 'classic') {
      return (
          <div id="D8isearchPicker">
            <Container>
                <Row>
                  <table className="table">
                    <tbody>
                      {results}
                    </tbody>
                  </table>
                </Row>
            </Container>
          </div>
      );
    }
    else if (this.state.displayType === 'circles' || this.state.displayType === 'cards') {
      return (
          <div id="D8isearchPicker">
            <Container>
                <Row>
                  {results}
                </Row>
            </Container>
          </div>
      );
    }

  }
}

export default D8isearchPicker;
