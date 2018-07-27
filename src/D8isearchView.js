import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row } from 'reactstrap';
import './D8isearchView.css';
import Loader from 'react-loader-spinner';
import Fade from 'react-reveal/Fade';

class D8isearchPicker extends Component {

  state = {
    ourData: [],
    isLoaded: false,
    callErr: true,
    errMsg: ''
  };

  componentDidMount() {
    const feedURL = this.props.dataFromPage.config
    axios.get(feedURL).then(response => {
      console.log(response);
      this.setState({
        ourData: response.data,
        isLoaded: true,
        callErr: false,
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
    let config = this.props.dataFromPage.config
    let results = this.state.ourData.map(( thisNode, index ) => {

      switch (this.props.dataFromPage.theme) {
        case 'Modern':
        return(
            <tr key={thisNode.eid}>
              <th scope="row">
                <img className="pictureOriginal" src={thisNode.photoUrl} onError={(e)=>{e.target.src="https://i.pinimg.com/originals/3a/fd/eb/3afdebe186623197d3500c70df74bfc4.png"}} alt={ 'profile picture for ' + thisNode.displayName } />
              </th>
              <td>
                <p>
                  <a className="linkOriginal" href={ 'https://isearch.asu.edu/profile/' + thisNode.eid }>{thisNode.displayName}</a>
                </p>
                <p className="titleOriginal">Modern: {thisNode.primaryTitle}</p>
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
          break;
        default:
        return(
            <tr key={thisNode.eid}>
              <th scope="row">
                <img className="pictureOriginal" src={thisNode.photoUrl} onError={(e)=>{e.target.src="https://i.pinimg.com/originals/3a/fd/eb/3afdebe186623197d3500c70df74bfc4.png"}} alt={ 'profile picture for ' + thisNode.displayName } />
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
    else {
      return (
        <Fade>
          <div id="D8isearchPicker">
            <Container>
                <Row>
                  <p><strong>Configuration here:</strong> {config}</p>
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

  }
}

export default D8isearchPicker;
