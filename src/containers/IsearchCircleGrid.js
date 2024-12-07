// ./src/components/App.js
import React from "react";
import { IsearchListView } from "../components/IsearchListView";
import { IsearchCircleGridView } from "../components/IsearchCircleGridView";
import Loader from "react-loader-spinner";

export const IsearchCircleGrid = ({ profileList, listConfig }) => {
  return (
    <div className="isearch-circle-grid">
      {profileList.map(
        (profile, index) => (
          (profile.listConfig = listConfig),
          (<IsearchCircleGridView key={index} {...profile} />)
        )
      )}
    </div>
  );
};

IsearchCircleGrid.defaultProps = {
  listConfig: {
    defaultPhoto:
      "https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
    showBio: true,
    showEmail: true,
    showPhone: true,
    showPhoto: true,
    showTitle: true,
    showExpertise: true,
  },
  profileList: [
    {
      loaded: true,
      eid: "1234",
      photoUrl: "",
      displayName: "",
      selectedDepTitle: "",
      shortBio: "",
      emailAddress: "",
      phone: "",
    },
    {
      loaded: true,
      eid: "1234",
      photoUrl: "",
      displayName: "",
      selectedDepTitle: "",
      shortBio: "",
      emailAddress: "",
      phone: "",
    },
    {
      loaded: true,
      eid: "1234",
      photoUrl: "",
      displayName: "",
      selectedDepTitle: "",
      shortBio: "",
      emailAddress: "",
      phone: "",
    },
  ],
};
