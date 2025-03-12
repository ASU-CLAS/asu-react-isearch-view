import React from "react";
import PropTypes from "prop-types";
import Loader from "react-loader-spinner";

import "./index.css";

export const IsearchListView = ({
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
  console.log("returning table row");
  console.log(expertise_areas);

  return (
    <div key={eid.raw} className="profile profile-type-standard">
      <div className="profile-row row">
        <div className="profile-photo-column col-12 col-sm-3 col-md-2">
          {listConfig.showPhoto && (
            <a href={`https://isearch.asu.edu/profile/${eid.raw}`}>
              <img
                className="pictureOriginal"
                src={photo_url.raw}
                onError={(e) => {
                  e.target.src = listConfig.defaultPhoto;
                }}
                alt={`profile picture for ${display_name.raw}`}
              />
            </a>
          )}
        </div>
        <div className="profile-bio-column col-12 col-sm-9 col-md-8">
          <h3 className="profile-name">
            <a href={`https://isearch.asu.edu/profile/${eid.raw}`}>
              {display_name.raw}
            </a>
          </h3>
          {listConfig.showTitle && (
            <div className="profile-title">
              <p className="titleOriginal">{selectedDepTitle}</p>
            </div>
          )}

          <div className="profile-contact-row">
            {listConfig.showEmail && email_address.raw && (
              <div className="">
                <p>
                  <a
                    className="linkOriginal"
                    href={`mailto:${email_address.raw}`}
                  >
                    {email_address.raw}
                  </a>
                </p>
              </div>
            )}
            {listConfig.showPhone && phone.raw && (
              <div className="">
                <p>
                  <a className="" href={`tel:${phone.raw}`}>
                    {phone.raw}
                  </a>
                </p>
              </div>
            )}
          </div>

          <p>{listConfig.showBio && short_bio.raw}</p>

          <p>
            {listConfig.showExpertise &&
              expertise_areas.raw != null &&
              expertise_areas.raw.length > 0 && (
                <span>
                  <label>Expertise Areas: </label>{" "}
                  <p>
                    {expertise_areas.raw.map((item, index) => (
                      <span>
                        {item}
                        {index < expertise_areas.raw.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                </span>
              )}
          </p>
        </div>
      </div>
    </div>
  );
};

IsearchListView.propTypes = {
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
   * iSearch profile short bio
   */
  short_bio: PropTypes.object,
  /**
   * config to show/hide profile data
   */
  listConfig: PropTypes.object,
};

IsearchListView.defaultProps = {
  email_address: "",
  loaded: true,
  phone: "",
  photo_url: "",
  selectedDepTitle: "",
  short_bio: "",
  listConfig: {
    showBio: true,
    defaultPhoto:
      "https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
    showEmail: true,
    showPhone: true,
    showPhoto: true,
    showTitle: true,
  },
};
