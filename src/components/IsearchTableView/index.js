import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';

import './index.css';

export const IsearchTableView = ({
  defaultPhoto,
  displayName,
  eid,
  emailAddress,
  loaded,
  phone,
  photoUrl,
  selectedDepTitle,
  shortBio,
  showDescription,
  showEmail,
  showPhone,
  showPhoto,
  showTitle,
}) => {
  if (!loaded) {
    return (
      <div className="loader">
        <Loader type="ThreeDots" color="#5C6670" height="100" width="100" />
      </div>
    );
  }

  return (
    <tr>
      <th scope="row">
        {showPhoto && (
          <a href={`https://isearch.asu.edu/profile/${eid}`}>
            <img
              className="pictureOriginal"
              src={photoUrl}
              onError={e => {
                e.target.src = defaultPhoto;
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
        {showTitle && <p className="titleOriginal">{selectedDepTitle}</p>}
        {showDescription && <p>{shortBio}</p>}
      </td>
      <td>
        {showEmail && (
          <p>
            <a className="linkOriginal" href={`mailto:${emailAddress}`}>
              {emailAddress}
            </a>
          </p>
        )}
        {showPhone && <p>{phone}</p>}
      </td>
    </tr>
  );
};

IsearchTableView.propTypes = {
  /**
   * String path to default photo
   */
  defaultPhoto: PropTypes.string,
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
   * Show profile description?
   */
  showDescription: PropTypes.bool,
  /**
   * Show profile email?
   */
  showEmail: PropTypes.bool,
  /**
   * Show profile phone?
   */
  showPhone: PropTypes.bool,
  /**
   * Show profile title?
   */
  showTitle: PropTypes.bool,
};

IsearchTableView.defaultProps = {
  defaultPhoto: '/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
  emailAddress: '',
  loaded: true,
  phone: '',
  photoUrl: '',
  selectedDepTitle: '',
  shortBio: '',
  showDescription: true,
  showEmail: true,
  showPhone: true,
  showTitle: true,
};
