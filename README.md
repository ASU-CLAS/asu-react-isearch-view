React component for displaying ASU directory listings from isearch.asu.edu. This React component can be used as a stand alone component and it has also been optimized for working inside of a Drupal environment.

### Demo: <a href="https://codepen.io/tkilbour/pen/qBqQwRQ" target="blank">iSearch directory React component on CodePen</a>

## Install (Stand Alone)
* `git clone https://github.com/ASU-CLAS/asu-react-isearch-view.git`
* `yarn` - install all dependencies
* `yarn build` - build project files in dist folder (react/react-dom are separated into vendor.js)
* `yarn dev` - build project files in dist folder and start webpack dev server (visit /drupal.html or /wordpress.html)

## Rendering the component

This React component will render inside an element with a class name of `clas-isearch-view`. The component requires the following options:

| Parameter     |  Options |
| ------------- | :------|  :------|
| data-config      | A JSON object with configuration options |

| Parameter     |  Allowed values |  Notes |
| ------------- | ------|  :------|
| type      | "customList", "depList" | If deplist, will assume ids is a list of isearch departments, if customList will assume a list of asurite ids |
| defaultPhoto      | absolute url string | |
| testURL      | absolute url string | |
| type      | "default", "classic", "cards", "circles" | default is the only Web Standards compliant option |
| ids      | array of strings | either asurite ids or dept ids |
| sourceIds      | array of numbers | list of dept ids to use titles from |

```JSON
{
  "type":"customList",
  "defaultPhoto":"https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
  "testURL":"https://cd8.lndo.site/clas-feeds/isearch/solr/",
  "displayType":"default",
  "ids":[
    "atpjk",
    "saibaba",
    "acerropa",
    "jjcohen4",
    "pmahdav2",
    "kkusumi",
    "kazilek",
    "lluecke",
    "fmilner"
  ],
  "sourceIds":[1409,88253,1457657,1409,1409,1409,1409,1409,1409],
    "showPhoto":true,
    "showTitle":true,
    "showBio":true,
    "showEmail":true,
    "showPhone":true
  }
```

There are 2 different structures for the config data depending on the 'type': customList, deptList

Example config object for customList (designed to give the end user complete control over who is displayed in the list):
This type has no sorting or filtering options because the asurites would be place manually in the correct order
```JSON
{
  "type":"customList",
  "defaultPhoto":"https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
  "testURL":"https://cd8.lndo.site/clas-feeds/isearch/solr/",
  "displayType":"default",
  "ids":[
    "atpjk",
    "saibaba",
    "acerropa",
    "jjcohen4",
    "pmahdav2",
    "kkusumi",
    "kazilek",
    "lluecke",
    "fmilner"
  ],
  "sourceIds":[1409,88253,1457657,1409,1409,1409,1409,1409,1409],
    "showPhoto":true,
    "showTitle":true,
    "showBio":true,
    "showEmail":true,
    "showPhone":true
  }
```

Example config object for depList (designed to be an easy to configure list that displays a single isearch dept):
selectedFilters is a list of employee types to show
titleFilter is a regular expression used to filter the list by titles
sort is not fully implemented, but should be able to toggle the list sorting between alphabetical (last name) and rank
```JSON
{
  "type":"depList",
  "displayType":"default",
  "defaultPhoto":"https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
  "testURL":"https://cd8.lndo.site/clas-feeds/isearch/solr/",
  "selectedFilters":["Academic Prof w/Admin Appt","Academic Professional","Administrative","Classified","Faculty","Faculty w/Admin Appointment","Graduate Assistant/Associate","Post Doctoral Scholars","University Staff"],
  "titleFilter":"/(Director)/i",
  "sortType":"alphabetical",
  "ids":[1409],
  "showPhoto":true,
  "showTitle":true,
  "showBio":true,
  "showEmail":true,
  "showPhone":true
}
```

```html
<div class="clas-isearch-view" data-config='{"type":"customList", "defaultPhoto":"https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png", "testURL":"https://cd8.lndo.site/clas-feeds/isearch/solr/","displayType":"default","ids":["atpjk","saibaba","acerropa","jjcohen4","pmahdav2","kkusumi","kazilek","lluecke","fmilner"],"sourceIds":[1409,88253,1457657,1409,1409,1409,1409,1409,1409],"showPhoto":true,"showTitle":true,"showBio":true,"showEmail":true,"showPhone":true}'></div>
```
