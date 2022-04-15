import React from 'react';
import Select from 'react-select';
import './index.css';

class IsearchExpertiseFilter extends React.Component {

  state = {
    selectedOption: null,
  };
  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption)
    );
  };
  
  render() {
    const { selectedOption } = this.state;

    return (
      <div>
        <label>Expertise filter:</label>
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

export default IsearchExpertiseFilter;