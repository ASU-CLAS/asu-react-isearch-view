// ./src/components/App.js
import React from 'react';
import {IsearchCardView} from '../components/IsearchCardView';
import Loader from 'react-loader-spinner';

export const IsearchCardList = ({
  profileList,
  listConfig,
}) => {

  return (
    <div className="isearch-circle-list">
    <div className="container"><div className="row row-spaced">
      {profileList.map((profileData, index) => (
        profileData.listConfig = listConfig,
        <div className="col col-12 col-md-6 col-lg-4"><IsearchCardView {...profileData} /></div>
      ))}
    </div></div></div>
  );
}

IsearchCardList.defaultProps = {
  listConfig: {
    defaultPhoto: 'https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
    showBio: true,
    showEmail: true,
    showPhone: true,
    showPhoto: true,
    showTitle: true,
    showExpertise: true,
    newTab: 'newTab'
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
