import React from 'react';
import Select from 'react-select';
import './index.css';

class IsearchExpertiseFilter extends React.Component {


  
  render() {

    return (
      <div>
        <label>Expertise filter:</label>
        <Select
        value={this.props.expertiseSelectedOption}
        onChange={this.props.expertiseHandleChange}
        isMulti={true}
        options={this.props.options}
        
      />
      </div>
      
    );
  }
};  

export default IsearchExpertiseFilter;