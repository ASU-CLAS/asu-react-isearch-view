import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

export const IsearchCardView = ({
  display_name,
  eid,
  email_address,
  loaded,
  phone,
  photo_url,
  selectedDepTitle,
  short_bio,
  expertise_areas,
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
            src={photo_url.raw}
            onError={e => {
              e.target.src = listConfig.defaultPhoto;
            }}
            alt={'profile picture for ' + display_name.raw}
          />
        )}
        <div className="card-header">
          <h3 className="card-title">
            <a className="" href={'https://isearch.asu.edu/profile/' + eid.raw}>
              {display_name.raw}
            </a>
          </h3>
        </div>
        <div className="card-body">
          {listConfig.showTitle && (
            <h6 className="card-subtitle mb-2 text-muted titleOriginal">{selectedDepTitle}</h6>
          )}
          {listConfig.showBio && <p>{short_bio.raw}</p>}
          {listConfig.showExpertise && expertise_areas.raw != null && expertise_areas.raw.length > 0 && <span><label>Expertise Areas: </label> <p>{expertise_areas.raw.map((item,index) => (<span>{item}{index < expertise_areas.raw.length - 1 && ', '}</span>) )}</p></span>}
          {listConfig.showEmail && (
            <p>
              <a className="linkOriginal" href={'mailto:' + email_address.raw}>
                {email_address.raw}
              </a>
            </p>
          )}
          <p>{listConfig.showPhone && phone.raw}</p>
        </div>
      </div>
  );
};

IsearchCardView.propTypes = {
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
   * iSearch profile selected expertise areas
   */
  expertise_areas: PropTypes.object,
  /**
   * iSearch profile short bio
   */
  short_bio: PropTypes.object,
  /**
   * config to show/hide profile data
   */
  listConfig: PropTypes.object,
};

IsearchCardView.defaultProps = {
  email_address: '',
  loaded: true,
  phone: '',
  photo_url: '',
  selectedDepTitle: '',
  short_bio: '',
  expertise_areas: [],
  listConfig: {
    showBio: true,
    showEmail: true,
    showPhone: true,
    showPhoto: true,
    showTitle: true,
  }
};
