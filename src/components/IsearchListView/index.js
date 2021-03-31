import PropTypes from "prop-types";
import Loader from "react-loader-spinner";

import "./index.css";

export const IsearchListView = ({
  classicDescription,
  classicEmail,
  classicPhone,
  classicPhoto,
  classicTitle,
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
  if (node == undefined) {
    return null;
  }

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
          {classicPhoto ? null : (
            <a href={"https://isearch.asu.edu/profile/" + eid}>
              <img
                className="pictureOriginal"
                src={photoUrl}
                onError={e => {
                  e.target.src = defaultPhoto;
                }}
                alt={"profile picture for " + displayName}
              />
            </a>
          )}
        </div>
        <div className="profile-bio-column">
          <h3 className="profile-name">
            <a href={"https://isearch.asu.edu/profile/" + eid}>{displayName}</a>
          </h3>
          <div className="profile-title">
            {classicTitle ? null : (
              <p className="titleOriginal">{selectedDepTitle}</p>
            )}
          </div>

          <div className="profile-contact-row">
            <div className="">
              <p>
                {classicEmail ? null : (
                  <a className="linkOriginal" href={"mailto:" + emailAddress}>
                    {emailAddress}
                  </a>
                )}
              </p>
            </div>
            <div className="">
              <p>
                {classicPhone ? null : (
                  <a className="" href={"tel:" + phone}>
                    {phone}
                  </a>
                )}
              </p>
            </div>
            <div className="">
              <p>
                {classicPhone ? null : (
                  <div>
                    {addressLine1}
                    <br />
                    {addressLine2}
                  </div>
                )}
              </p>
            </div>
          </div>

          <p>{classicDescription ? null : shortBio}</p>
        </div>
      </div>
    </div>
  );
};

IsearchListView.propTypes = {
  /**
   * Render classic description format?
   */
  classicDescription: PropTypes.bool,
  /**
   * Render classic email format?
   */
  classicEmail: PropTypes.bool,
  /**
   * Render classic phone format?
   */
  classicPhone: PropTypes.bool,
  /**
   * Render classic title format?
   */
  classicTitle: PropTypes.bool,
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
  loaded: PropTypes.string,
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

IsearchListView.defaultProps = {
  classicDescription: false,
  classicEmail: false,
  classicPhone: false,
  classicTitle: false,
  defaultPhoto:
    "/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
  emailAddress: "",
  loaded: true,
  phone: "",
  photoUrl: "",
  selectedDepTitle: "",
  shortBio: "",
};
