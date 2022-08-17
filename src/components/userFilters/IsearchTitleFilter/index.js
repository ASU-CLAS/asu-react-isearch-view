import React from 'react';
import Select from 'react-select';
import './index.css';

class IsearchTitleFilter extends React.Component {

  render() {

    return (
      <div>
        <label>Title filter:</label>
        <Select
        value={this.props.titleSelectedOption}
        onChange={this.props.titleHandleChange}
        isMulti={true}
        options={this.props.options}
        
      />
      </div>
      
    );
  }
};  

export default IsearchTitleFilter;