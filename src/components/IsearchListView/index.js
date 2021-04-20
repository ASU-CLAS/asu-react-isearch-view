import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';

import './index.css';

export const IsearchListView = ({
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
  if (!loaded) {
    return (
      <div className="loader">
        <Loader type="ThreeDots" color="#5C6670" height="100" width="100" />
      </div>
    );
  }
  return (
    <div key={eid} className="profile profile-type-standard">
      <div className="profile-row">
        <div className="profile-photo-column">
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
        </div>
        <div className="profile-bio-column">
          <h3 className="profile-name">
            <a href={`https://isearch.asu.edu/profile/${eid}`}>{displayName}</a>
          </h3>
          {listConfig.showTitle && (
            <div className="profile-title">
              <p className="titleOriginal">{selectedDepTitle}</p>
            </div>
          )}

          <div className="profile-contact-row">
            {listConfig.showEmail && (
              <div className="">
                <p>
                  <a className="linkOriginal" href={`mailto:${emailAddress}`}>
                    {emailAddress}
                  </a>
                </p>
              </div>
            )}
            {listConfig.showPhone && (
              <div className="">
                <p>
                  <a className="" href={`tel:${phone}`}>
                    {phone}
                  </a>
                </p>
              </div>
            )}
            {listConfig.showPhone && (
              <div className="">
                  <div>
                    {addressLine1}
                    <br />
                    {addressLine2}
                  </div>
              </div>
            )}
          </div>

          <p>{listConfig.showBio && shortBio}</p>
        </div>
      </div>
    </div>
  );
};

IsearchListView.propTypes = {
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
   * iSearch profile address line 1
   */
  addressLine1: PropTypes.string,
  /**
   * iSearch profile address line 2
   */
  addressLine2: PropTypes.string,
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
   * Render show description format?
   */
  showDescription: PropTypes.bool,
  /**
   * Render show email format?
   */
  showEmail: PropTypes.bool,
  /**
   * Render show phone format?
   */
  showPhone: PropTypes.bool,
  /**
   * Render show title format?
   */
  showTitle: PropTypes.bool,
};

IsearchListView.defaultProps = {
  addressLine1: '',
  addressLine2: '',
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
