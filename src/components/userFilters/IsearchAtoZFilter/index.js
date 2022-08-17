import React from 'react';

import './index.css';

class IsearchAtoZFilter extends React.Component {


render(){

 let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

 // uses selected letter state found in main component onClick function
 let alphabetList = alphabet.map( letter =>
        {
            return(
                <a href="" className={this.props.selectedLetter === letter ? 'active-letter' : null} onClick={this.props.onClick} id={letter} key={letter}><span className="" id={letter}>{letter}</span></a>
            )
        }
    )

  return (
     <div className="alphabet">{alphabetList}</div>
  );}
};  

export default IsearchAtoZFilter;
