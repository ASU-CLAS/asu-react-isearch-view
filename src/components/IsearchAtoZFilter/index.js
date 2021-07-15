import React from 'react';

import './index.css';

class IsearchAtoZFilter extends React.Component {

handleClick(element){
    console.log(element, "walla walla")
    event.preventDefault();
}

render(){
 let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

 let alphabetList = alphabet.map( letter =>
        {
            return(
                <a href="" onClick={(e) => this.handleClick(e.target.id)}><span className="" id={letter}>{letter}</span></a>
            )
        }
    )

    console.log(alphabet, alphabetList, "beepo")

  return (
     <div className="chonk">{alphabetList}</div>
  );}
};  

export default IsearchAtoZFilter;
