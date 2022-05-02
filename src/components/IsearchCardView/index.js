import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

export const IsearchCardView = ({
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
  expertiseAreas,
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
      <div className="card card-isearch">
        {listConfig.showPhoto && (
          <img
            className="card-img-top"
            src={photoUrl}
            onError={e => {
              e.target.src = listConfig.defaultPhoto;
            }}
            alt={'profile picture for ' + displayName}
          />
        )}
        <div className="card-header">
          <h3 className="card-title">
            <a className="" href={'https://isearch.asu.edu/profile/' + eid}>
              {displayName}
            </a>
          </h3>
        </div>
        <div className="card-body">
          {listConfig.showTitle && (
            <h6 className="card-subtitle mb-2 text-muted titleOriginal">{selectedDepTitle}</h6>
          )}
          {listConfig.showBio && <p>{shortBio}</p>}
          {listConfig.showExpertise && expertiseAreas.length > 0 && <span><label>Expertise Areas: </label> <p>{expertiseAreas.map((item,index) => (<span>{item}{index < expertiseAreas.length - 1 && ', '}</span>) )}</p></span>}
          {listConfig.showEmail && (
            <p>
              <a className="linkOriginal" href={'mailto:' + emailAddress}>
                {emailAddress}
              </a>
            </p>
          )}
          <p>{listConfig.showPhone && phone}</p>
        </div>
      </div>
  );
};

IsearchCardView.propTypes = {
  /**
   * iSearch profile Display Name
   */
  displayName: PropTypes.string.isRequired,
  /**
   * iSearch profile EID
   */
  eid: PropTypes.number.isRequired,
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
   * iSearch profile selected expertise areas
   */
  expertiseAreas: PropTypes.array,
  /**
   * iSearch profile short bio
   */
  shortBio: PropTypes.string,
  /**
   * config to show/hide profile data
   */
  listConfig: PropTypes.object,
};

IsearchCardView.defaultProps = {
  addressLine1: '',
  addressLine2: '',
  emailAddress: '',
  loaded: true,
  phone: '',
  photoUrl: '',
  selectedDepTitle: '',
  shortBio: '',
  expertiseAreas: [],
  listConfig: {
    showBio: true,
    showEmail: true,
    showPhone: true,
    showPhoto: true,
    showTitle: true,
  }
};
