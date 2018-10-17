import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import './D8isearchView.css';
import Loader from 'react-loader-spinner';
import Fade from 'react-reveal/Fade';

class D8isearchPicker extends Component {

  state = {
    ourData: [],
    isLoaded: false,
    callErr: true,
    errMsg: '',
    displayType: 'classic'
  };

  componentDidMount() {
    // const feedURL = this.props.dataFromPage.config
    console.log(this.props.dataFromPage.config)
    const feedData = JSON.parse(this.props.dataFromPage.config)
    let feedURL = ''

    if (feedData.type === 'depList') {
      feedURL = '/clas-feeds/isearch/solr/q=deptids:' + feedData.ids[0] + '&rows=2000&wt=json'
    }
    else {
      let asuriteIds = feedData.ids.join(' OR ')
      feedURL = '/clas-feeds/isearch/solr/q=asuriteId:('+ asuriteIds + ')&wt=json'
    }

    axios.get(feedURL).then(response => {

      console.log(response);
      let orderedProfileResults = response.data.response.docs
      if (feedData.type === 'customList') {
        // order results
        orderedProfileResults = feedData.ids.map(item => {
          for (var i = 0; i < response.data.response.docs.length; i++) {
            if (item === response.data.response.docs[i].asuriteId) {
              return response.data.response.docs[i]
            }
          }
        })
      }
      else {
        // order filtered results
        orderedProfileResults = orderedProfileResults.filter( profile => feedData.selectedFilters.includes(profile.primarySimplifiedEmplClass))
        if (feedData.titleFilter !== '') {
          if (feedData.titleFilter[0] === '/') {
            console.log('its regex')
            const filter = feedData.titleFilter.slice(1, -1);
            let regexConstructor = new RegExp(filter);
            orderedProfileResults = orderedProfileResults.filter( profile => regexConstructor.test(profile.primaryTitle))
          }
          else {
            console.log('its a string')
            orderedProfileResults = orderedProfileResults.filter( profile => profile.primaryTitle === feedData.titleFilter)
          }


        }
        orderedProfileResults = orderedProfileResults.sort((a, b) => a.firstName.localeCompare(b.firstName))
      }


      this.setState({
        ourData: orderedProfileResults,
        isLoaded: true,
        callErr: false,
        displayType: feedData.displayType
      }, () => {
        console.log(this.state.ourData);
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
    let results = this.state.ourData.map(( thisNode, index ) => {

      switch (this.state.displayType) {
        case 'modern':
        return(
            <Col sm="3" key={thisNode.eid} className="modernCol">
              <div class="ch-item ch-img-1" style={{backgroundImage: 'url(' + thisNode.photoUrl + '), url(https://clas.asu.edu/sites/default/files/styles/panopoly_image_original/public/avatar.png)'}}>
                <div class="ch-info-wrap">
                  <div class="ch-info">
                    <div class="ch-info-front ch-img-1"></div>
                    <div class="ch-info-back">
                      <h3>{thisNode.displayName}</h3>
                      <p>{thisNode.primaryTitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          )
          break;
        case 'modernOG':
        return(
            <Col sm="3" key={thisNode.eid}>
              <div className="modernProfile">
                <img src={thisNode.photoUrl} onError={(e)=>{e.target.src="https://clas.asu.edu/sites/default/files/styles/panopoly_image_original/public/avatar.png"}} alt={ 'profile picture for ' + thisNode.displayName } />
                <a className="linkOriginal" href={ 'https://isearch.asu.edu/profile/' + thisNode.eid }>{thisNode.displayName}</a>
                <p className="titleOriginal">{thisNode.primaryTitle}</p>
                <p>{thisNode.shortBio}</p>
                <p>
                  <a className="linkOriginal" href={ 'mailto:' + thisNode.emailAddress }>{thisNode.emailAddress}</a>
                </p>
                <p>{thisNode.phone}</p>
              </div>
            </Col>
          )
          break;
        default:
        return(
            <tr key={thisNode.eid}>
              <th scope="row">
                <img className="pictureOriginal" src={thisNode.photoUrl} onError={(e)=>{e.target.src="https://clas.asu.edu/sites/default/files/styles/panopoly_image_original/public/avatar.png"}} alt={ 'profile picture for ' + thisNode.displayName } />
              </th>
              <td>
                <p>
                  <a className="linkOriginal" href={ 'https://isearch.asu.edu/profile/' + thisNode.eid }>{thisNode.displayName}</a>
                </p>
                <p className="titleOriginal">{thisNode.primaryTitle}</p>
                <p>{thisNode.shortBio}</p>
              </td>
              <td>
                <p>
                  <a className="linkOriginal" href={ 'mailto:' + thisNode.emailAddress }>{thisNode.emailAddress}</a>
                </p>
                <p>{thisNode.phone}</p>
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
        <Fade>
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
        </Fade>
      );
    }
    else if (this.state.displayType === 'modern') {
      return (
        <Fade>
          <div id="D8isearchPicker">
            <Container>
                <Row>
                  {results}
                </Row>
            </Container>
          </div>
        </Fade>
      );
    }

  }
}

export default D8isearchPicker;
