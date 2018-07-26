import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row } from 'reactstrap';
import './D8isearchView.css';

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
      return(
        <div key={thisNode.asuriteId}>
          <p>Name: {thisNode.displayName} ({thisNode.asuriteId})</p>
        </div>

      )
    })

    return (
      <div id="D8isearchPicker">
        <Container>
            <Row>
              <p><strong>Configuration here:</strong> {config}</p>
              <p><strong>Results here:</strong></p>
              {results}
            </Row>
        </Container>
      </div>
    );
  }
}

export default D8isearchPicker;
