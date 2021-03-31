import PropTypes from "prop-types";
import Loader from "react-loader-spinner";

import "./index.css";

export const IsearchTableView = ({
  classicDescription,
  classicEmail,
  classicPhone,
  classicPhoto,
  classicTitle,
  defaultPhoto,
  loaded,
  node,
}) => {
  // Don't know why node would be undefined but sometimes it is
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
    <tr key={node.eid}>
      <th scope="row">
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
      </th>
      <td>
        <h3 className="card-title">
          <a href={"https://isearch.asu.edu/profile/" + node.eid}>
            {node.displayName}
          </a>
        </h3>
        {classicTitle ? null : (
          <p className="titleOriginal">{node.selectedDepTitle}</p>
        )}
        <p>{classicDescription ? null : node.shortBio}</p>
      </td>
      <td>
        <p>
          {classicEmail ? null : (
            <a className="linkOriginal" href={"mailto:" + node.emailAddress}>
              {node.emailAddress}
            </a>
          )}
        </p>
        <p>{classicPhone ? null : node.phone}</p>
      </td>
    </tr>
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
