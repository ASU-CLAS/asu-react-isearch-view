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
  loaded,
  node,
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
    <div key={node.eid} className="profile profile-type-standard">
      <div className="profile-row">
        <div className="profile-photo-column">
          {classicPhoto ? null : (
            <a href={"https://isearch.asu.edu/profile/" + node.eid}>
              <img
                className="pictureOriginal"
                src={node.photoUrl}
                onError={e => {
                  e.target.src = defaultPhoto;
                }}
                alt={"profile picture for " + node.displayName}
              />
            </a>
          )}
        </div>
        <div className="profile-bio-column">
          <h3 className="profile-name">
            <a href={"https://isearch.asu.edu/profile/" + node.eid}>
              {node.displayName}
            </a>
          </h3>
          <div className="profile-title">
            {classicTitle ? null : (
              <p className="titleOriginal">{node.selectedDepTitle}</p>
            )}
          </div>

          <div className="profile-contact-row">
            <div className="">
              <p>
                {classicEmail ? null : (
                  <a
                    className="linkOriginal"
                    href={"mailto:" + node.emailAddress}
                  >
                    {node.emailAddress}
                  </a>
                )}
              </p>
            </div>
            <div className="">
              <p>
                {classicPhone ? null : (
                  <a className="" href={"tel:" + node.phone}>
                    {node.phone}
                  </a>
                )}
              </p>
            </div>
            <div className="">
              <p>
                {classicPhone ? null : (
                  <div>
                    {node.addressLine1}
                    <br />
                    {node.addressLine2}
                  </div>
                )}
              </p>
            </div>
          </div>

          <p>{classicDescription ? null : node.shortBio}</p>
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
   * Is application data currently loading?
   */
  loaded: PropTypes.string,
  /**
   * An individual profile node
   */
  node: PropTypes.string.isRequired,
};

IsearchListView.defaultProps = {
  classicDescription: false,
  classicEmail: false,
  classicPhone: false,
  classicTitle: false,
  defaultPhoto:
    "/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
  loaded: true,
};
