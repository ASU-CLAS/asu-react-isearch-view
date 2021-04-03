import React from 'react';
import PropTypes from 'prop-types';
import {Col} from 'reactstrap';
import Loader from 'react-loader-spinner';

import './index.css';

export const IsearchCardView = ({
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
    <Col sm="3">
      <div className="card isearch-card">
        {showPhoto && (
          <img
            className="card-img-top"
            src={photoUrl}
            onError={e => {
              e.target.src = defaultPhoto;
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
          {showTitle && (
            <h6 className="card-subtitle mb-2 text-muted titleOriginal">{selectedDepTitle}</h6>
          )}
          {showDescription && <p>{shortBio}</p>}
          {showEmail && (
            <p>
              <a className="linkOriginal" href={'mailto:' + emailAddress}>
                {emailAddress}
              </a>
            </p>
          )}
          <p>{showPhone && phone}</p>
        </div>
      </div>
    </Col>
  );
};

IsearchCardView.propTypes = {
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
   * iSearch profile short bio
   */
  shortBio: PropTypes.string,
  /**
   * iSearch display profile description
   */
  showDescription: PropTypes.bool,
  /**
   * iSearch display profile email
   */
  showEmail: PropTypes.bool,
  /**
   * iSearch display profile phone
   */
  showPhone: PropTypes.bool,
  /**
   * iSearch display profile photo
   */
  showPhoto: PropTypes.bool,
  /**
   * iSearch display profile title
   */
  showTitle: PropTypes.bool,
};

IsearchCardView.defaultProps = {
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
  showPhoto: true,
  showTitle: true,
};
