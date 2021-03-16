import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import './index.css';
import Loader from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faGooglePlusSquare, faLinkedin, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import IsearchProfileTab from './IsearchProfileTab';

class IsearchProfileView extends Component {

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
    // console.log(this.props.dataFromPage)
    const feedData = JSON.parse(this.props.dataFromPage.config)
    let feedURL = '/clas-feeds/isearch/solr/'

    if(feedData.testURL !== undefined) {
      feedURL = feedData.testURL
    }

    if (feedData.type === 'depList') {
      feedURL = feedURL + 'q=deptids:' + feedData.ids[0] + '&rows=2000&wt=json'
    }
    else {
      feedURL = feedURL + 'q=eid:(' + (window.location.pathname).replace('/profiles', '') + ')&rows=300&wt=json'
    }

    axios.get(feedURL).then(response => {

      //console.log(response);
      let orderedProfileResults = response.data.response.docs
      if (feedData.type === 'customList') {
        // order results and assign custom titles
        orderedProfileResults = feedData.ids.map(( item, index ) => {
          for (var i = 0; i < response.data.response.docs.length; i++) {
            if (item === response.data.response.docs[i].asuriteId) {
              // get the sourceID index to use for selecting the right title, sourceID would be the department this profile was selected from
              var titleIndex = -1;
              // some profiles don't have deptids ???
              if(response.data.response.docs[i].deptids !== undefined) {
                titleIndex = response.data.response.docs[i].deptids.indexOf(feedData.sourceIds[index].toString())
              }
              // if there is no eid then use asurite in place
              if(response.data.response.docs[i].eid === undefined) {
                response.data.response.docs[i].eid = response.data.response.docs[i].asuriteId
              }
              // if there is no sourceID for this profile, then we should default to the workingTitle field
              if(titleIndex === -1) {
                response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].workingTitle
              }
              // if there is a sourceID index, use it to select the correct title from the titles array
              else {
                response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].titles[titleIndex]
                // however! if the title source array indicates workingTitle, then use the workingTitle field instead of the department title in the title array
                if(response.data.response.docs[i].titleSource[titleIndex] === 'workingTitle') {
                  response.data.response.docs[i].selectedDepTitle = response.data.response.docs[i].workingTitle
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
          if(item.titleSource[titleIndex] === 'workingTitle') {
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
            this.setState({
              isLoaded: true,
              callErr: true,
              errMsg: 'Server responded with a status code of: ' + error.response.status
            })

        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            this.setState({
              isLoaded: true,
              callErr: true,
              errMsg: 'The request was made but no response was received.'
            })
        } else {
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
        }
        // display config info for error
        // console.log(error.config);
    });
  }

  // default -> Table View
  render() {
    let config = JSON.parse(this.props.dataFromPage.config);
    if(config.defaultPhoto === undefined) {
      config.defaultPhoto = "/profiles/openclas/modules/custom/clas_isearch/images/avatar.png";
    }

    let results = this.state.ourData.map(( thisNode, index ) => {
      console.log(thisNode);
      // Don't know why thisNode would be undefined but sometimes it is
      if(thisNode === undefined) {
        return null;
      }

      let biographyTab = ["Biography",
        (thisNode.careers ? "<h4>Student Information</h4><div>" + thisNode.careers + "</div><div>" + thisNode.majors + "</div><div>" + thisNode.programs + "</div>" : "") +
        (thisNode.bio ? "<h4>Biography</h4>" + thisNode.bio : "") +
        (thisNode.cvUrl ? "<h4>CV</h4><a href='https://isearch.asu.edu/profile/" + thisNode.eid + "/cv' target='_blank'>Curriculum Vitae</a>" : "") +
        (thisNode.education ? "<h4>Education</h4>" + thisNode.education : "")];

      let researchTab = ["Research",
        (thisNode.researchWebsite !== " " ? "<h4>Research Website URL</h4><a href='" + thisNode.researchWebsite + "' target='_blank'>" + thisNode.researchWebsite + "</a>" : "") +
        (thisNode.researchInterests ? "<h4>Research Interests</h4>" + thisNode.researchInterests : "")];

      let tabs = [];

      if(biographyTab[1] !== "") {
        tabs.push(biographyTab);
      }

      if(researchTab[1] !== "") {
        tabs.push(researchTab);
      }

      let positions = [];

      if(Array.isArray(thisNode.titles)) {
        thisNode.titles.map((item, index) =>

          positions.push([[item],[thisNode.departments[index]]])

        )
      } else {

        positions.push([[thisNode.primaryTitle], [thisNode.primaryDepartment]])

      }

      return(
        <div key={thisNode.eid}>

          <div className="masthead">

            <Container>

              <Row>

                <Col lg="3">

                  {/* Thumbnail image */}
                  { thisNode.photoUrl  ?
                    <img className="pictureOriginal profileViewThumbnail" src={thisNode.photoUrl} onError={(e)=>{e.target.src=config.defaultPhoto}} alt={ 'profile picture for ' + thisNode.displayName } /> :
                    null
                  }

                </Col>

                <Col>

                  {/* Display name */}
                  <h1>
                    {thisNode.displayName}
                  </h1>

                  {/* Title, Department listings */}
                  {Array.isArray(positions) ? (
                    <div className="titleOrgArea">
                      { positions.map(value => {
                        return (
                          <div>
                            <strong>{ value[0] }</strong>
                            { ", " + value[1] }
                          </div>
                        )
                      })}
                    </div>
                  ) :
                    null
                  }

                  {/* Contact area */}
                  {(thisNode.emailAddress || thisNode.phone || config.addressLine1 || config.city) ? (
                    <div className="contactArea">
                      { thisNode.emailAddress ? <div><a href={ 'mailto:' + thisNode.emailAddress }>{ thisNode.emailAddress }</a></div> : null}
                      { thisNode.phone ? <div><a href={ 'tel:' + thisNode.phone.replace('/', '-') }>{ thisNode.phone.replace('/', '-') }</a></div> : null }
                      <div>
                        {(thisNode.addressLine1 || thisNode.addressLine2) ? (
                          <div>
                            { thisNode.addressLine1 ? thisNode.addressLine1 + (thisNode.addressLine2 ? " " : "") : null}
                            { thisNode.addressLine2 ? thisNode.addressLine2 : null}
                          </div>
                        ) :
                          null
                        }
                        {(thisNode.city || thisNode.postalCode) ? (
                          <div>
                            { thisNode.city ? thisNode.city + (thisNode.postalCode ? ", " : "") : null }
                            { thisNode.postalCode ? thisNode.postalCode : null }
                          </div>
                        ) :
                          null
                        }
                      </div>
                    </div>
                  ) :
                    null
                  }

                  {/* Social platforms */}
                  {(thisNode.emailAddress || thisNode.phone || config.addressLine1 || config.city) ? (
                    <div className="socialArea">
                      { thisNode.facebook !== " " ? <a href={ thisNode.facebook } target="_blank"><FontAwesomeIcon icon={ faFacebookSquare } /></a> : null }
                      { thisNode.twitter !== " " ? <a href={ thisNode.twitter } target="_blank"><FontAwesomeIcon icon={ faLinkedin } /></a> : null }
                      { thisNode.linkedin !== " " ? <a href={ thisNode.linkedin } target="_blank"><FontAwesomeIcon icon={ faTwitterSquare } /></a> : null }
                      { thisNode.googlePlus !== " " ? <a href={ thisNode.googlePlus } target="_blank"><FontAwesomeIcon icon={ faGooglePlusSquare } /></a> : null }
                      { thisNode.website !== " " ? <a href={ thisNode.website } target="_blank"><FontAwesomeIcon icon={ faGlobe } /></a> : null }
                    </div>
                  ) :
                    null
                  }

                </Col>

              </Row>

            </Container>

          </div>

          <div className="breadcrumbs">

            <Container>

              <Row>

                <Col>

                  {/* Breadcrumbs */}
                  <Breadcrumb>
                    <BreadcrumbItem><a href="/">Home</a></BreadcrumbItem>
                    <BreadcrumbItem><a href="/profiles">Search</a></BreadcrumbItem>
                    <BreadcrumbItem active>{ thisNode.displayName }</BreadcrumbItem>
                  </Breadcrumb>

                </Col>

              </Row>

            </Container>

          </div>

          <div class="profile">

            <Container>

              <Row>

                <Col>

                  {/* IsearchProfileTab */}
                  <IsearchProfileTab tabs={ tabs } />

                </Col>

                {/* Expertise sidebar */}
                {(Array.isArray(thisNode.expertiseAreas)) ? (
                  <Col lg="3">
                    <div className="expertise">
                      <h4>Expertise areas</h4>
                      { thisNode.expertiseAreas.map(value => {
                        return (
                          <div><a href={ "/" + value.toLowerCase().replace(" ", "-") }>{ value }</a></div>
                        )
                      })}
                    </div>
                  </Col>
                ) :
                  null
                }

              </Row>

            </Container>

          </div>

        </div>
      )

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
          <div id="iSearchProfileView">
            {results}
          </div>
      );
    }

  }
}

export default IsearchProfileView;
