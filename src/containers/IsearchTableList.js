// ./src/components/App.js
import React from 'react';
import {IsearchTableView} from '../components/IsearchTableView';
import Loader from 'react-loader-spinner';

export const IsearchTableList = ({
  profileList,
  listConfig,
}) => {

  return (
    <div id="isearch-table-list">
        <table className="table">
          <tbody>
            {profileList.map((profile, index) => (
              profile.listConfig = listConfig,
              <IsearchTableView {...profile} key={index} />
            ))}
          </tbody>
        </table>
    </div>
  );
}

IsearchTableList.defaultProps = {
  listConfig: {
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
