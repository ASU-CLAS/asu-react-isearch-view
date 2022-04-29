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
      {profileList.map((profileData, index) => (
        profileData.listConfig = listConfig,
        <div className="col col-6 modernCol col-md-4 col-lg-3"><IsearchCircleView key={index} {...profileData} /></div>
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
      photoUrl: '',
      displayName: '',
      selectedDepTitle: '',
      shortBio: '',
      emailAddress: '',
      phone: '',
    },
    {
      loaded: true,
      eid: '1234',
      photoUrl: '',
      displayName: '',
      selectedDepTitle: '',
      shortBio: '',
      emailAddress: '',
      phone: '',
    },
    {
      loaded: true,
      eid: '1234',
      photoUrl: '',
      displayName: '',
      selectedDepTitle: '',
      shortBio: '',
      emailAddress: '',
      phone: '',
    }
  ],
};
