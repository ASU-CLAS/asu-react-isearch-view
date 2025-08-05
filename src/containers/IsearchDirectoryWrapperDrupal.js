import React, { Component } from "react";
import axios from "axios";
import { IsearchTableView } from "../components/IsearchTableView";
import { IsearchTableList } from "../containers/IsearchTableList";
import { IsearchDefaultList } from "../containers/IsearchDefaultList";
import { IsearchCircleList } from "../containers/IsearchCircleList";
import { IsearchCardList } from "../containers/IsearchCardList";
import IsearchAtoZFilter from "../components/IsearchAtoZFilter/index.js";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";
import EventEmitter from "events";

const debug = false;

class IsearchDirectoryWrapperDrupal extends Component {
  constructor(props) {
    super(props);
    if (debug) console.log(props);
    this.state = {
      ourData: [],
      profileList: [],
      filterActive: false,
      filterLetter: "",
      isLoaded: false,
      callErr: true,
      errMsg: "",
    };
  }

  processTitles(person) {
    if (debug) {
      console.log("Processing title for: " + person.asurite_id.raw);
    }

    // if there is no eid then use asurite in place
    if (person.eid.raw == undefined) {
      person.eid.raw = person.asurite_id.raw;
    }
    // if there is no sourceID for this profile, display primary department and custom title, fallback to primary title
    if (person.depMatch == "unknown") {
      if (person.working_title != undefined) {
        person.selectedDepTitle = person.working_title.raw[0];
        person.displayDep = person.primary_department.raw;
        if (debug) {
          console.log("No sourceID, use working title");
          console.log(person.working_title.raw);
        }
      } else {
        // if no custom title, fallback to primary title
        if (person.primary_title.raw != undefined) {
          person.selectedDepTitle = person.primary_title.raw;
          if (debug) {
            console.log("No sourceID, no working title, use primary title");
            console.log(person.primary_title?.raw);
          }
        }
      }
    }
    //if the sourceID matches the person's primary department, display custom title, fallback to primary title
    else if (person.depMatch == "primary") {
      if (debug) {
        console.log("Set title via matching sourceID and primary dept");
      }

      if (person.working_title.raw != undefined) {
        person.selectedDepTitle = person.working_title.raw;
      } else {
        person.selectedDepTitle = person.primary_title.raw;
      }
    }
    // if there is a sourceID index and it does NOT match the primary department, display custom title if it exists, otherwise display NO title
    else {
      if (person.working_title) {
        if (debug) {
          console.log("Non-primary department, use custom title");
        }
        person.selectedDepTitle = person.working_title.raw;
      } else {
        if (debug) {
          console.log("Check for courtesy affiliate status");
        }
        if (person.primary_affiliation.raw === "COURTESY_AFFILIATE") {
          if (person.subaffiliations) {
            person.selectedDepTitle = this.processSubaffiliationTitles(person);
          } else {
            person.selectedDepTitle = "Courtesy Affiliate";
          }
        }
        if (
          person.primary_affiliation.raw === "STUDENT" &&
          person.primary_department?.raw === undefined
        ) {
          if (debug) {
            console.log(
              "person is a student: if careers listed, display first title; otherwise display no title"
            );
          }
          person.selectedDepTitle = person.careers.raw[0] ?? false;
        }
      }
    }

    if (debug) {
      console.log("Title result: " + person.selectedDepTitle);
    }
    return person.selectedDepTitle;
  }

  processSubaffiliationTitles(person) {
    const subaffiliations = person.subaffiliations.raw;
    if (subaffiliations) {
      const emeritus = subaffiliations.filter((affiliation) =>
        affiliation.match(/emeritus(?: \w+)* professor/i)
      );
      console.log(emeritus);
      const retired = subaffiliations.filter((affiliation) =>
        affiliation.match(/retired(?: \w+)*/i)
      );
      console.log(retired);

      if (emeritus != undefined && emeritus.length >= 1) {
        return emeritus[0];
      } else if (retired != undefined && retired.length >= 1) {
        return retired[0];
      } else {
        return subaffiliations[0];
      }
    } else {
      return false;
    }
  }

  componentDidMount() {
    const isearchConfig = JSON.parse(this.props.dataFromPage.config);

    let feedURL = isearchConfig.endpointURL;
    let feedBase = isearchConfig.endpointURL;
    console.log("iSearch Viewer - 2.2.1");
    console.log("Developed by The College of Liberal Arts and Sciences");
    console.log("https://github.com/ASU-CLAS/asu-react-isearch-view");
    console.log("---");

    // fallback for older CLAS CMS usage
    if (isearchConfig.endpointURL == undefined) {
      feedBase = "https://search.asu.edu/api/v1/";
    }

    // depList and customList need to use different solr queries
    if (isearchConfig.type === "depList") {
      feedURL =
        feedBase +
        "webdir-profiles/faculty-staff/filtered?dept_ids=" +
        isearchConfig.ids[0] +
        "&size=999" +
        "&client=clas";

      if (isearchConfig.sortType == "rank") {
        feedURL += "&sort-by=faculty_rank";
      }

      if (isearchConfig.sortType == "rank" && isearchConfig.rankIds) {
        feedURL += "&rank_group=" + isearchConfig.rankIds;
      }
    } else {
      let asuriteIds = isearchConfig.ids.join(",");
      feedURL =
        feedBase +
        "webdir-profiles/faculty-staff/filtered?asurite_ids=" +
        asuriteIds +
        `&size=${isearchConfig.ids.length}` +
        "&client=clas";
    }

    if (debug) console.log(feedURL);

    axios
      .get(feedURL)
      .then((response) => {
        let subAffProfiles = [];

        let orderedProfileResults = response.data.results;
        JSON.stringify(orderedProfileResults);

        if (isearchConfig.type === "customList") {
          // order results and assign custom titles
          orderedProfileResults = isearchConfig.ids.map((item, index) => {
            for (var i = 0; i < response.data.results.length; i++) {
              if (debug) console.log("-- " + i + " --");
              //console.log(response.data.results[i]);
              if (item === response.data.results[i].asurite_id.raw) {
                // get the sourceID index to use for selecting the right title, sourceID would be the department this profile was selected from
                response.data.results[i].depMatch = "unknown";
                // some profiles don't have deptids ???
                if (isearchConfig.sourceIds[index]) {
                  console.log("id found");
                } else {
                  console.log(isearchConfig.sourceIds[index]);
                }
                if (
                  response.data.results[i].deptids != undefined &&
                  response.data.results[i].deptids.raw != undefined &&
                  isearchConfig.sourceIds[index] != undefined
                ) {
                  // check if sourceID matches the person's 'primary department', otherwise match sourceID with department in the person's departments array
                  if (
                    response.data.results[i].primary_deptid.raw ===
                    isearchConfig.sourceIds[index].toString()
                  ) {
                    response.data.results[i].depMatch = "primary";
                  } else {
                    response.data.results[i].depMatch = "non-primary";
                  }
                }
                response.data.results[i].displayDep = null;
                response.data.results[i].selectedDepTitle = this.processTitles(
                  response.data.results[i]
                );

                return response.data.results[i];
              }
            }
          });
        } else {
          //assign custom titles and rank
          orderedProfileResults = orderedProfileResults.map((item, index) => {
            if (debug) console.log("-- " + index + " --");
            // get the array index of this dept
            let listDep = isearchConfig.ids[0].toString();
            item.titleIndex = item.deptids.raw.indexOf(listDep);
            if (item.primary_deptid == listDep) {
              item.depMatch = "primary";
            } else {
              item.depMatch = "non-primary";
            }

            item.selectedDepTitle = this.processTitles(item);

            // if (isearchConfig.sortType === 'rank') {
            //   if ( typeof item.faculty_rank !== 'undefined' )
            //     item.selectedDepRank = item.faculty_rank.raw;
            //   else
            //     item.selectedDepRank = 100;
            // }

            if (isearchConfig.sortType === "weight") {
              if (typeof item.employee_weight !== "undefined")
                item.selectedDepRank =
                  item.employee_weight.raw[item.titleIndex];
              else item.selectedDepRank = 999;
            }

            return item;
          });

          // filter results by subaffilation type (subAffFilters)
          if (typeof isearchConfig.subAffFilters !== "undefined") {
            function handleSubAffiliates(profile) {
              if ("subaffiliations" in profile) {
                if (
                  isearchConfig.subAffFilters.some((filter) =>
                    profile.subaffiliations.raw.includes(filter)
                  )
                ) {
                  return profile;
                }
              }
            }

            subAffProfiles = response.data.results.filter(handleSubAffiliates);
          }

          // filter results by employee type (selectedFilters)
          if (typeof isearchConfig.selectedFilters !== "undefined") {
            if (debug) console.log(orderedProfileResults, "before filter");
            const courtesyAffiliateEnabled =
              isearchConfig.selectedFilters.includes("Courtesy Affiliate");
            const emeritusEnabled =
              isearchConfig.selectedFilters.includes("Emeritus");

            function handleCourtesyAffiliates(profile) {
              if ("primary_simplified_empl_class" in profile) {
                if (
                  isearchConfig.selectedFilters.includes(
                    profile.primary_simplified_empl_class.raw[0]
                  )
                ) {
                  return profile;
                } else if (
                  isearchConfig.selectedFilters.includes(
                    "Faculty w/Admin Appointment"
                  ) &&
                  profile.primary_simplified_empl_class.raw[0] ===
                    "Administrative Appointment"
                ) {
                  return profile;
                }
              } else {
                const isCourtesyAffiliate =
                  profile.affiliations.raw.includes("Courtesy Affiliate");

                var isEmeritus = false;
                // Check for Emeritus
                if (profile.titles && profile.titles.raw.length > 0) {
                  profile.titles.raw.forEach((title) => {
                    if (
                      title &&
                      (title.includes("Emeritus") || title.includes("Emerita"))
                    ) {
                      isEmeritus = true;
                    }
                  });
                }

                if (courtesyAffiliateEnabled && isCourtesyAffiliate) {
                  if (isEmeritus && !emeritusEnabled) return null;
                  else return profile;
                } else if (isEmeritus && emeritusEnabled) {
                  return profile;
                }
              }
            }

            orderedProfileResults = orderedProfileResults.filter(
              handleCourtesyAffiliates
            );
            if (debug) console.log(orderedProfileResults, "after filter");
          }

          // filter results by title (titleFilter)
          if (typeof isearchConfig.titleFilter !== "undefined") {
            // check if the title filter is in regex format
            if (isearchConfig.titleFilter[0] === "/") {
              const pattern = isearchConfig.titleFilter.match(/\/(.*)\//).pop();
              const flags = isearchConfig.titleFilter.substr(
                isearchConfig.titleFilter.lastIndexOf("/") + 1
              );
              let regexConstructor = new RegExp(pattern, flags);
              orderedProfileResults = orderedProfileResults.filter((profile) =>
                regexConstructor.test(profile.selectedDepTitle)
              );
            } else {
              orderedProfileResults = orderedProfileResults.filter(
                (profile) => {
                  if (profile.selectedDepTitle !== null)
                    return profile.selectedDepTitle
                      .toLowerCase()
                      .includes(isearchConfig.titleFilter.toLowerCase());
                }
              );
            }
          }

          // filter results by expertise (expertiseFilter)
          if (
            typeof isearchConfig.expertiseFilter === "string" &&
            isearchConfig.expertiseFilter !== ""
          ) {
            // check if the expertisefilter is in regex format
            if (isearchConfig.expertiseFilter[0] === "/") {
              const pattern = isearchConfig.expertiseFilter
                .match(/\/(.*)\//)
                .pop();
              const flags = isearchConfig.expertiseFilter.substr(
                isearchConfig.expertiseFilter.lastIndexOf("/") + 1
              );
              let regexConstructor = new RegExp(pattern, flags);
              orderedProfileResults = orderedProfileResults.filter(
                (profile) => {
                  if (profile.expertise_areas.raw) {
                    let matches = profile.expertise_areas.raw.filter((exp) =>
                      regexConstructor.test(exp)
                    );
                    return matches.length > 0;
                  }
                }
              );
            } else {
              orderedProfileResults = orderedProfileResults.filter(
                (profile) => {
                  if (profile.expertise_areas.raw) {
                    let matches = profile.expertise_areas.raw.filter((exp) =>
                      isearchConfig.expertiseFilter
                        .toLowerCase()
                        .includes(exp.toLowerCase())
                    ); // logic reversed so .include filters correctly (e.g. searching for Aging should not return results for Bioimaging)
                    return matches.length > 0;
                  }
                }
              );
            }
          }
          /*************** find examples of profiles with subaffilations ******************/
          // add subaffiliates to array before sorting
          if (subAffProfiles.length > 0) {
            orderedProfileResults.push(...subAffProfiles);
          }

          // sort results by isearch weight/rank
          //if (isearchConfig.sortType === 'rank' || isearchConfig.sortType === 'weight' ) {
          if (isearchConfig.sortType === "weight") {
            orderedProfileResults = orderedProfileResults.sort((a, b) => {
              if (a.selectedDepRank === b.selectedDepRank) {
                return a.last_name.raw.localeCompare(b.last_name.raw);
              } else {
                return a.selectedDepRank - b.selectedDepRank;
              }
            });
          } else if (isearchConfig.sortType === "rank") {
          }
          // otherwise sort alpha
          else {
            orderedProfileResults = orderedProfileResults.sort((a, b) =>
              a.last_name.raw.localeCompare(b.last_name.raw)
            );
          }
        }

        this.setState(
          {
            profileList: orderedProfileResults,
            ourData: orderedProfileResults,
            isLoaded: true,
            callErr: false,
          },
          () => {
            //console.log(this.state.ourData);
          }
        );
      })
      .catch((error) => {
        // API call error catching
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response);
          this.setState({
            isLoaded: true,
            callErr: true,
            errMsg:
              "Server responded with a status code of: " +
              error.response.status,
          });
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
          this.setState({
            isLoaded: true,
            callErr: true,
            errMsg: "The request was made but no response was received.",
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        //display config info for error
        console.log(error.config);
      });
  }

  handleClick(element) {
    // if user clicks the same letter twice, it undos the filter and repopulates display profiles array with orig data
    if (
      this.state.filterActive === true &&
      this.state.filterLetter === element
    ) {
      this.setState({
        ourData: this.state.profileList,
        filterActive: false,
        filterLetter: "",
      });
    } else {
      // filters through original data on each change, adds letter filter, and then sets results to display profiles array
      let filteredProfileResults = this.state.profileList.filter(
        (profile) =>
          profile.last_name.raw[0].toLowerCase().charAt(0) ===
          element.toLowerCase()
      );

      this.setState({
        ourData: filteredProfileResults,
        filterActive: true,
        filterLetter: element,
      });
    }
    // console.log(this.state.filterActive, "after test")

    event.preventDefault();
  }

  render() {
    let config = JSON.parse(this.props.dataFromPage.config);

    //console.log(this.state.filterActive, "checking filter")
    // check for missing config options and set defaults
    if (config.defaultPhoto == undefined) {
      config.defaultPhoto =
        "https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png";
    }
    if (config.showBio == undefined) {
      config.showBio = true;
    }
    if (config.showTitle == undefined) {
      config.showTitle = true;
    }
    if (config.showPhoto == undefined) {
      config.showPhoto = true;
    }
    if (config.showPhone == undefined) {
      config.showPhone = true;
    }
    if (config.showEmail == undefined) {
      config.showEmail = true;
    }
    if (config.showExpertise == undefined) {
      config.showExpertise = true;
    }
    if (config.showFilterAZ == undefined) {
      config.showFilterAZ = false;
    }

    let results = this.state.ourData.filter(Boolean);

    // loading animation
    if (!this.state.isLoaded) {
      return (
        <div className="loader">
          <Loader type="ThreeDots" color="#5C6670" height="100" width="100" />
        </div>
      );
    } else if (config.displayType === "default") {
      return (
        <div>
          {config.showFilterAZ == true && (
            <IsearchAtoZFilter
              selectedLetter={this.state.filterLetter}
              onClick={(e) => this.handleClick(e.target.id)}
            />
          )}
          <IsearchDefaultList profileList={results} listConfig={config} />
        </div>
      );
    } else if (
      config.displayType === "table" ||
      config.displayType === "classic"
    ) {
      return (
        <div>
          {config.showFilterAZ == true && (
            <IsearchAtoZFilter
              selectedLetter={this.state.filterLetter}
              onClick={(e) => this.handleClick(e.target.id)}
            />
          )}
          <IsearchTableList profileList={results} listConfig={config} />
        </div>
      );
    } else if (config.displayType === "circles") {
      return (
        <div>
          {config.showFilterAZ == true && (
            <IsearchAtoZFilter
              selectedLetter={this.state.filterLetter}
              onClick={(e) => this.handleClick(e.target.id)}
            />
          )}
          <IsearchCircleList profileList={results} listConfig={config} />
        </div>
      );
    } else if (config.displayType === "cards") {
      return (
        <div>
          {config.showFilterAZ == true && (
            <IsearchAtoZFilter
              selectedLetter={this.state.filterLetter}
              onClick={(e) => this.handleClick(e.target.id)}
            />
          )}
          <IsearchCardList profileList={results} listConfig={config} />
        </div>
      );
    }
  }
}

IsearchDirectoryWrapperDrupal.propTypes = {
  dataFromPage: PropTypes.object.isRequired,
  /*
  dataFromPage: PropTypes.shape({
    type: PropTypes.string.isRequired,
    defaultPhoto: PropTypes.string,
    endpointURL: PropTypes.string,
    displayType: PropTypes.string.isRequired,
    ids: PropTypes.array.isRequired,
    sourceIds: PropTypes.array,
    showPhoto: PropTypes.string,
    showTitle: PropTypes.string,
    showBio: PropTypes.string,
    showEmail: PropTypes.string,
    showPhone: PropTypes.string,
    showExpertise: PropTypes.string
  }).isRequired,
  */
};

export default IsearchDirectoryWrapperDrupal;
