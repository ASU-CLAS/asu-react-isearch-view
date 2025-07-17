import React from 'react';
import PropTypes from 'prop-types';
import {Col} from 'reactstrap';
import Loader from 'react-loader-spinner';

import './index.css';

export const IsearchCircleView = ({
  circleHover,
  defaultPhoto,
  display_name,
  eid,
  email_address,
  loaded,
  phone,
  photo_url,
  selectedDepTitle,
  displayDep,
  expertise_areas,
  short_bio,
}) => {
  if (!loaded) {
    return (
      <div className="loader">
        <Loader type="ThreeDots" color="#5C6670" height="100" width="100" />
      </div>
    );
  }

  return (
    <div>
      {circleHover ? (
        <div
          className="ch-item ch-img-1"
          data-toggle="modal"
          data-target={`.bd-isearch-modal-${eid.raw}`}
          style={{
            backgroundImage: `url(${photo_url.raw}), url(${defaultPhoto})`,
          }}
        >
          <div className="ch-info-wrap">
            <div className="ch-info">
              <div className="ch-info-front ch-img-1"></div>
              <div className="ch-info-back">
                <h3>{display_name.raw}</h3>
                <p>{selectedDepTitle}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="modernProfile">
            <img
              src={photo_url.raw}
              data-toggle="modal"
              data-target={`.bd-isearch-modal-${eid.raw}`}
              onError={e => {
                e.target.src = defaultPhoto;
              }}
              alt={`profile picture for ${display_name.raw}`}
            />
          </div>
          <div style={{textAlign: 'center'}}>
            <a className="" href={`https://isearch.asu.edu/profile/${eid.raw}`}>
              {display_name.raw}
            </a>
            <p className="">{selectedDepTitle}</p>
          </div>
        </div>
      )}

      <div className={`modal fade bd-isearch-modal-${eid.raw}`} aria-label={`${display_name.raw}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog isearch-card-modal">
          <div className="modal-content">
            <div className="card isearch-card">
              <button type="button" className="close x" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
              <img
                className="pictureModal"
                src={photo_url.raw}
                onError={e => {
                  e.target.src = defaultPhoto;
                }}
                alt={`${display_name.raw}`}
              />
              <div className="card-body">
                <h4 className="card-title">
                  <a className="linkOriginal" href={`https://isearch.asu.edu/profile/${eid.raw}`}>
                    {display_name.raw}
                  </a>
                </h4>
                <h6 className="card-subtitle mb-2 text-muted titleOriginal">{selectedDepTitle}</h6>
                <p>{short_bio.raw}</p>
                {expertise_areas.length > 0 && <span><label>Expertise Areas: </label> <p>{expertise_areas.map((item,index) => (<span>{item}{index < expertise_areas.length - 1 && ', '}</span>) )}</p></span>}
                <p>
                  <a className="linkOriginal" href={`mailto:${email_address.raw}`}>
                    {email_address.raw}
                  </a>
                </p>
                <p>{phone.raw}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

IsearchCircleView.propTypes = {
  /**
   * Circle view hovers (?)
   */
  circleHover: PropTypes.bool,
  /**
   * String path to default photo
   */
  defaultPhoto: PropTypes.string,
  /**
   * iSearch profile Display Name
   */
  display_name: PropTypes.object.isRequired,
  /**
   * iSearch profile EID
   */
  eid: PropTypes.object.isRequired,
  /**
   * iSearch profile email address
   */
  email_address: PropTypes.object,
  /**
   * Is application data currently loading?
   */
  loaded: PropTypes.bool,
  /**
   * iSearch profile phone
   */
  phone: PropTypes.object,
  /**
   * iSearch profile photo
   */
  photo_url: PropTypes.object,
  /**
   * iSearch profile selected department title
   */
  selectedDepTitle: PropTypes.string,
  /**
   * iSearch profile department
   */
  displayDep: PropTypes.string,
  /**
   * iSearch profile selected expertise areas
   */
  expertise_areas: PropTypes.object,
  /**
   * iSearch profile short bio
   */
  short_bio: PropTypes.object,
};

IsearchCircleView.defaultProps = {
  circleHover: true,
  defaultPhoto: 'https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
  email_address: '',
  loaded: true,
  phone: '',
  photo_url: {raw: ''},
  selectedDepTitle: '',
  displayDep: null,
  short_bio: '',
  expertise_areas: '',
};
