import React from "react";
import PropTypes from "prop-types";
import Loader from "react-loader-spinner";

import "./index.css";

export const IsearchTableView = ({
  display_name,
  eid,
  email_address,
  loaded,
  phone,
  photo_url,
  selectedDepTitle,
  displayDep,
  short_bio,
  expertise_areas,
  listConfig,
}) => {
  //console.log('returning table row')
  //console.log(expertise_areas)

  return (
    <tr className="row tableRow">
      <th className="col-12 col-sm-3 col-md-2" scope="row">
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
      </th>
      <td className="col-12 col-sm-9 col-md-8">
        <h3 className="card-title">
          <a href={`https://isearch.asu.edu/profile/${eid.raw}`}>
            {display_name.raw}
          </a>
        </h3>
        {listConfig.showTitle && (
          <p className="titleOriginal">{selectedDepTitle}{displayDep && <span >, <span className="departmentOriginal">{displayDep}</span></span>}</p>
        )}
        {listConfig.showBio && <p>{short_bio.raw}</p>}
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
      </td>
      <td className="col-12 col-md-2">
        {listConfig.showEmail && (
          <p className="noWrap">
            <a className="linkOriginal" href={`mailto:${email_address.raw}`}>
              {email_address.raw}
            </a>
          </p>
        )}
        {listConfig.showPhone && <p className="noWrap">{phone.raw}</p>}
      </td>
    </tr>
  );
};

IsearchTableView.propTypes = {
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
  /**
   * config to show/hide profile data
   */
  listConfig: PropTypes.object,
};

IsearchTableView.defaultProps = {
  display_name: { raw: "" },
  eid: { raw: "1234" },
  email_address: { raw: "" },
  loaded: true,
  phone: { raw: "" },
  photo_url: { raw: "" },
  selectedDepTitle: "",
  displayDep: null,
  short_bio: { raw: "" },
  expertise_areas: { raw: [] },
  listConfig: {
    showBio: true,
    defaultPhoto:
      "https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
    showEmail: true,
    showPhone: true,
    showPhoto: true,
    showTitle: true,
    showExpertise: true,
  },
};
