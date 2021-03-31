import React from 'react';
import PropTypes from 'prop-types';
import {Col} from 'reactstrap';
import Loader from 'react-loader-spinner';

import './index.css';

export const IsearchCardView = ({
  circlesHover,
  defaultPhoto,
  displayName,
  eid,
  emailAddress,
  loaded,
  phone,
  photoUrl,
  selectedDepTitle,
  shortBio,
}) => {
  if (!loaded) {
    return (
      <div className="loader">
        <Loader type="ThreeDots" color="#5C6670" height="100" width="100" />
      </div>
    );
  }

  return (
    <Col sm="3" key={eid} className="modernCol">
      {circlesHover ? (
        <div
          class="ch-item ch-img-1"
          data-toggle="modal"
          data-target={`.bd-isearch-modal-${eid}`}
          style={{
            backgroundImage: `url(${photoUrl}), url(${defaultPhoto})`,
          }}
        >
          <div class="ch-info-wrap">
            <div class="ch-info">
              <div class="ch-info-front ch-img-1"></div>
              <div class="ch-info-back">
                <h3>{displayName}</h3>
                <p>{selectedDepTitle}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="modernProfile">
            <img
              src={photoUrl}
              data-toggle="modal"
              data-target={`.bd-isearch-modal-${eid}`}
              onError={e => {
                e.target.src = defaultPhoto;
              }}
              alt={`profile picture for ${displayName}`}
            />
          </div>
          <div style={{textAlign: 'center'}}>
            <a className="" href={`https://isearch.asu.edu/profile/${eid}`}>
              {displayName}
            </a>
            <p className="">{selectedDepTitle}</p>
          </div>
        </div>
      )}

      <div class={`modal fade bd-isearch-modal-${eid}`} tabIndex="-1" role="dialog">
        <div class="modal-dialog isearch-card-modal">
          <div class="modal-content">
            <div class="card isearch-card">
              <button type="button" class="close x" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
              <img
                class="pictureModal"
                src={photoUrl}
                onError={e => {
                  e.target.src = defaultPhoto;
                }}
                alt={`profile picture for ${displayName}`}
              />
              <div class="card-body">
                <h5 class="card-title">
                  <a className="linkOriginal" href={`https://isearch.asu.edu/profile/${eid}`}>
                    {displayName}
                  </a>
                </h5>
                <h6 class="card-subtitle mb-2 text-muted titleOriginal">{selectedDepTitle}</h6>
                <p>{shortBio}</p>
                <p>
                  <a className="linkOriginal" href={`mailto:${emailAddress}`}>
                    {emailAddress}
                  </a>
                </p>
                <p>{phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

IsearchCardView.propTypes = {
  /**
   * Circle (photo) hovers (?)
   */
  circlesHover: PropTypes.string,
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
};

IsearchCardView.defaultProps = {
  circlesHover: false,
  defaultPhoto: '/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
  emailAddress: '',
  loaded: true,
  phone: '',
  photoUrl: '',
  selectedDepTitle: '',
  shortBio: '',
};
