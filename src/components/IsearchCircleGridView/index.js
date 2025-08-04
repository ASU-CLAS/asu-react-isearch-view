import { WebDirectoryComponent } from "@asu/app-webdir-ui";

const display = {
  defaultSort: "last_name",
  doNotDisplayProfiles: "",
  profilesPerPage: "60",
  usePager: "1",
};
const filters = {
  employee: "",
  expertise: "",
  title: "",
  campuses: "",
};
const args = {
  alphaFilter: "false",
};
const IsearchCircleGridView = ({ listConfig }) => {
  console.log(listConfig);
  const display = {
    defaultSort: listConfig.sortType === "alpha" ? "last_name" : "rank",
    profilesPerPage: 12,
    usePager: "1",
  };

  let ids = "";
  for (const [index, element] of listConfig.ids.entries()) {
    ids = ids.concat(element + ":" + listConfig.sourceIds[index] + ",");
  }

  console.log(ids);
  return (
    <WebDirectoryComponent
      searchType="people_departments"
      ids={ids}
      API_URL="https://search.asu.edu"
      searchApiVersion="/api/v1/"
      display={display}
      alphaFilter={args.alphaFilter}
    />
  );
};

IsearchCircleGridView.defaultProps = {
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

export default IsearchCircleGridView;
