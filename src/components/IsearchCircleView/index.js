import PropTypes from "prop-types";
import { Col } from "reactstrap";
import Loader from "react-loader-spinner";

import "./index.css";

export const IsearchCircleView = ({
  circlesHover,
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
    <Col sm="3" key={node.eid} className="modernCol">
      {circlesHover ? (
        <div
          class="ch-item ch-img-1"
          data-toggle="modal"
          data-target={".bd-isearch-modal-" + node.eid}
          style={{
            backgroundImage:
              "url(" + node.photoUrl + "), url(" + defaultPhoto + ")",
          }}
        >
          <div class="ch-info-wrap">
            <div class="ch-info">
              <div class="ch-info-front ch-img-1"></div>
              <div class="ch-info-back">
                <h3>{node.displayName}</h3>
                <p>{node.selectedDepTitle}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="modernProfile">
            <img
              src={node.photoUrl}
              data-toggle="modal"
              data-target={".bd-isearch-modal-" + node.eid}
              onError={e => {
                e.target.src = defaultPhoto;
              }}
              alt={"profile picture for " + node.displayName}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <a
              className=""
              href={"https://isearch.asu.edu/profile/" + node.eid}
            >
              {node.displayName}
            </a>
            <p className="">{node.selectedDepTitle}</p>
          </div>
        </div>
      )}

      <div
        class={"modal fade bd-isearch-modal-" + node.eid}
        tabindex="-1"
        role="dialog"
      >
        <div class="modal-dialog isearch-card-modal">
          <div class="modal-content">
            <div class="card isearch-card">
              <button
                type="button"
                class="close x"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              <img
                class="pictureModal"
                src={node.photoUrl}
                onError={e => {
                  e.target.src = defaultPhoto;
                }}
                alt={"profile picture for " + node.displayName}
              />
              <div class="card-body">
                <h5 class="card-title">
                  <a
                    className="linkOriginal"
                    href={"https://isearch.asu.edu/profile/" + node.eid}
                  >
                    {node.displayName}
                  </a>
                </h5>
                <h6 class="card-subtitle mb-2 text-muted titleOriginal">
                  {node.selectedDepTitle}
                </h6>
                <p>{node.shortBio}</p>
                <p>
                  <a
                    className="linkOriginal"
                    href={"mailto:" + node.emailAddress}
                  >
                    {node.emailAddress}
                  </a>
                </p>
                <p>{node.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

IsearchCircleView.propTypes = {
  /**
   * Circle view hovers (?)
   */
  circlesHover: PropTypes.string,
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

IsearchCircleView.defaultProps = {
  circlesHover: false,
  defaultPhoto:
    "/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
  loaded: true,
};
