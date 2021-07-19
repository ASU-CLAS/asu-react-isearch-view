import React from 'react';

import './index.css';

class IsearchAtoZFilter extends React.Component {


render(){
 let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

 let alphabetList = alphabet.map( letter =>
        {
            return(
                <a href="" onClick={this.props.onClick}><span className="" id={letter}>{letter}</span></a>
            )
        }
    )

  return (
     <div className="chonk">{alphabetList}</div>
  );}
};  

export default IsearchAtoZFilter;
