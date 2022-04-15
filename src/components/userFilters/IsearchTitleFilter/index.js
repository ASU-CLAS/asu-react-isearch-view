import React from 'react';
import Select from 'react-select';
import './index.css';

class IsearchTitleFilter extends React.Component {

  state = {
    selectedOption: null,
  };
  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption)
    );

    let filteredProfileResults = []
    
    selectedOption.forEach(option => {
      filteredProfileResults = this.props.profileList.filter( profile => profile.primaryTitle === option.value)
    })

    this.props.callbackFromParent(filteredProfileResults);
    
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <div>
        <label>Title filter:</label>
        <Select
        value={selectedOption}
        onChange={this.handleChange}
        isMulti={true}
        options={this.props.options}
        
      />
      </div>
      
    );
  }
};  

export default IsearchTitleFilter;