import React from 'react';

import './index.css';

class IsearchTitleFilter extends React.Component {


render(){

 let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

 // uses selected letter state found in main component onClick function
 let alphabetList = alphabet.map( letter =>
        {
            return(
                <a href="" className={this.props.selectedLetter === letter ? 'active-letter' : null} onClick={this.props.onClick} id={letter}><span className="" id={letter}>{letter}</span></a>
            )
        }
    )

  return (
    <form className="flex-column">
    {/* <div className="custom-select"> */}
    <select
      className="dropdown"
      name="convertTo"
      value={convertTo}
      onChange={this.handleDropDown}
    >
      {this.state.currencies.map(currency => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
    {/* </div> */}
    <input
      className="result_input"
      value={
        amount === ""
          ? "0"
          : result === isNaN
          ? "Calculating..."
          : result
      }
    />
  </form>
  );}
};  

export default IsearchTitleFilter;