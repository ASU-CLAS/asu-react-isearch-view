import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';

import './index.css';

export const IsearchTableView = ({
  addressLine1,
  addressLine2,
  displayName,
  eid,
  emailAddress,
  loaded,
  phone,
  photoUrl,
  selectedDepTitle,
  shortBio,
  listConfig,
}) => {
  console.log('returning table row')
  return (
    <tr>
      <th scope="row">
        {listConfig.showPhoto && (
          <a href={`https://isearch.asu.edu/profile/${eid}`}>
            <img
              className="pictureOriginal"
              src={photoUrl}
              onError={e => {
                e.target.src = listConfig.defaultPhoto;
              }}
              alt={`profile picture for ${displayName}`}
            />
          </a>
        )}
      </th>
      <td>
        <h3 className="card-title">
          <a href={`https://isearch.asu.edu/profile/${eid}`}>{displayName}</a>
        </h3>
        {listConfig.showTitle && <p className="titleOriginal">{selectedDepTitle}</p>}
        {listConfig.showBio && <p>{shortBio}</p>}
      </td>
      <td>
        {listConfig.showEmail && (
          <p>
            <a className="linkOriginal" href={`mailto:${emailAddress}`}>
              {emailAddress}
            </a>
          </p>
        )}
        {listConfig.showPhone && <p>{phone}</p>}
      </td>
    </tr>
  );
};

IsearchTableView.propTypes = {
  /**
   * iSearch profile Display Name
   */
  displayName: PropTypes.string.isRequired,
  /**
   * iSearch profile EID
   */
  eid: PropTypes.string.isRequired,
  /**
   * iSearch profile email address
   */
  emailAddress: PropTypes.string,
  /**
   * Is application data currently loading?
   */
  loaded: PropTypes.bool,
  /**
   * iSearch profile phone
   */
  phone: PropTypes.string,
  /**
   * iSearch profile photo
   */
  photoUrl: PropTypes.string,
  /**
   * iSearch profile selected department title
   */
  selectedDepTitle: PropTypes.string,
  /**
   * iSearch profile short bio
   */
  shortBio: PropTypes.string,
  /**
   * config to show/hide profile data
   */
  listConfig: PropTypes.object,
};

IsearchTableView.defaultProps = {
  addressLine1: '',
  addressLine2: '',
  displayName: '',
  eid:"1234",
  emailAddress: '',
  loaded: true,
  phone: '',
  photoUrl: '',
  selectedDepTitle: '',
  shortBio: '',
  listConfig: {
    showBio: true,
    defaultPhoto: 'https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
    showEmail: true,
    showPhone: true,
    showPhoto: true,
    showTitle: true,
  }
};
