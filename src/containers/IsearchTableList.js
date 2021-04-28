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
            {profileList.map((profileData, index) => (
              profileData.listConfig = listConfig,
              <IsearchTableView {...profileData} />
            ))}
          </tbody>
        </table>
    </div>
  );
}

IsearchTableList.defaultProps = {
  listConfig: {
    defaultPhoto: 'https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
    showBio: true,
    showEmail: true,
    showPhone: true,
    showPhoto: true,
    showTitle: true,
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
