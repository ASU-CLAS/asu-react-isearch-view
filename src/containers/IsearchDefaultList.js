// ./src/components/App.js
import React from 'react';
import {IsearchListView} from '../components/IsearchListView';
import Loader from 'react-loader-spinner';

export const IsearchDefaultList = ({
  profileList,
  listConfig,
}) => {

  return (
    <div className="isearch-default-list">
      {profileList.map((profileData, index) => (
        profileData.listConfig = listConfig,
        <IsearchListView key={profileData.eid} {...profileData} />
      ))}
    </div>
  );
}

IsearchDefaultList.defaultProps = {
  listConfig: {
    defaultPhoto: 'https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
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
