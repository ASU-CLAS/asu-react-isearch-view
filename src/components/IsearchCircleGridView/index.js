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
const ids = {
  ids: "",
  depIds: "",
};
const API_URL = "https://search.asu.edu";
const searchApiVersion = "/api/v1/";

const IsearchCircleGridView = ({ listConfig }) => {
  console.log(listConfig);

  if (listConfig.type === "customList") {
    for (const [index, element] of listConfig.ids.entries()) {
      ids.ids = ids.ids.concat(
        element + ":" + listConfig.sourceIds[index] + ","
      );
    }
  } else {
    ids.depIds = listConfig.ids.toString();
  }

  filters.employee = listConfig.selectedFilters?.toString();
  filters.expertise = listConfig.expertiseFilter;
  filters.title = listConfig.titleFilter;
  args.alphaFilter = listConfig.showFilterAZ.toString();
  display.defaultSort = listConfig.sortType === "rank" && "people_order"

  return (
    <>
      {listConfig.type === "depList" ? (
        <WebDirectoryComponent
          searchType="faculty_rank"
          deptIds={ids.depIds}
          API_URL={API_URL}
          searchApiVersion={searchApiVersion}
          filters={filters}
          display={display}
        />
      ) : (
        <WebDirectoryComponent
          searchType="people"
          ids={ids.ids}
          API_URL={API_URL}
          searchApiVersion={searchApiVersion}
          display={display}
          alphaFilter={args.alphaFilter}
        />
      )}
    </>
  );
};

// IsearchCircleGridView.defaultProps = {
//   listConfig: {
//     defaultPhoto:
//       "https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
//     showBio: true,
//     showEmail: true,
//     showPhone: true,
//     showPhoto: true,
//     showTitle: true,
//     showExpertise: true,
//   },
//   profileList: [
//     {
//       loaded: true,
//       eid: "1234",
//       photoUrl: "",
//       displayName: "",
//       selectedDepTitle: "",
//       shortBio: "",
//       emailAddress: "",
//       phone: "",
//     },
//     {
//       loaded: true,
//       eid: "1234",
//       photoUrl: "",
//       displayName: "",
//       selectedDepTitle: "",
//       shortBio: "",
//       emailAddress: "",
//       phone: "",
//     },
//     {
//       loaded: true,
//       eid: "1234",
//       photoUrl: "",
//       displayName: "",
//       selectedDepTitle: "",
//       shortBio: "",
//       emailAddress: "",
//       phone: "",
//     },
//   ],
// };

export default IsearchCircleGridView;
