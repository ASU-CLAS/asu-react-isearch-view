// ./src/components/App.js
import React from 'react'
import {IsearchCircleView} from '../components/IsearchCircleView'
import Loader from 'react-loader-spinner'
import Avatar from "../components/images/avatar.png"

export const IsearchCircleList = ({
  profileList,
  listConfig,
}) => {

  return (
    <div className="isearch-circle-list">
    <div className="container"><div className="row">
<<<<<<< HEAD
      {profileList.map((profileData, index) => (
        profileData.listConfig = listConfig,
        <div className="col col-6 modernCol col-md-4 col-lg-3"><IsearchCircleView key={index} {...profileData} /></div>
=======
      {console.log(`circle list data:`)}
      {console.log(profileList)}
      {profileList.map((profile, index) => (
        console.log(profile),
        profile.listConfig = listConfig,
        <div className="col col-6 modernCol col-md-4 col-lg-3" key={index}><IsearchCircleView {...profile} /></div>
        
>>>>>>> a5e531f13c3237f4487295c94add3ecb33a52596
      ))}
    </div></div></div>
  );
}

IsearchCircleList.defaultProps = {
  listConfig: {
    defaultPhoto: Avatar,
    showBio: true,
    showEmail: true,
    showPhone: true,
    showPhoto: true,
    showTitle: true,
    showExpertise: true
  },
  profileList: [
    {
      loaded: true,
      eid: '1234',
      photo_url: {raw: ''}, 
      displayName: 'Test 1',
      selectedDepTitle: 'Test Title 1',
      shortBio: '',
      emailAddress: '',
      phone: '',
    },
    {
      loaded: true,
      eid: '1234',
      photo_url: {raw: ''},
      displayName: 'Test 2',
      selectedDepTitle: 'Test Title 2',
      shortBio: '',
      emailAddress: '',
      phone: '',
    },
    {
      loaded: true,
      eid: '1234',
      photo_url: {raw: ''},
      displayName: 'Test 3',
      selectedDepTitle: 'Test Title 3',
      shortBio: '',
      emailAddress: '',
      phone: '',
    }
  ],
};
