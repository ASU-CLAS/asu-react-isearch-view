import React from 'react';
import Select from 'react-select';
import './index.css';

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];

class IsearchExpertiseFilter extends React.Component {

  state = {
    selectedOption: null,
  };
  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption)
    );
  };
  getExpertiseList(){
    
  }
  render() {
    const { selectedOption } = this.state;

    return (
      <div>
        <label>Expertise filter:</label>
        <Select
        value={selectedOption}
        onChange={this.handleChange}
        isMulti={true}
        options={this.props.selectFilterOptions}
        
      />
      </div>
      
    );
  }
};  

export default IsearchExpertiseFilter;