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

    let filteredProfileResults = []
    let profileList = this.props.profileList

    if(selectedOption.length === 0){
      this.props.callbackFromParent(profileList)
      this.props.callbackFromParentSetState(false)
    } else {
      selectedOption.forEach(option => {
        profileList.forEach(profile => {
          if (profile.expertiseAreas !== undefined) {
            profile.expertiseAreas.forEach(area => {
              if(area === option.value){
                filteredProfileResults.push(profile)
              }
            })
          }
        })
      })
      this.props.callbackFromParentSetState(true)
      this.props.callbackFromParent(filteredProfileResults);
    }    
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