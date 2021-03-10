React component for displaying ASU directory listings from isearch.asu.edu. This React component can be used as a stand alone component and it has also been optimized for working inside of a Drupal environment.

### Demo: <a href="https://codepen.io/tkilbour/pen/qBqQwRQ" target="blank">iSearch directory React component on CodePen</a>

## Install (Stand Alone)
* `git clone https://github.com/ASU-CLAS/asu-react-d8news.git`
* `yarn` - install all dependencies
* `yarn build` - build project files (Includes React Library- will need to install ASU UDS Bootstrap separately )


## Install (Drupal)
* `git clone https://github.com/ASU-CLAS/asu-react-d8news.git`
* `yarn` - install all dependencies
* `yarn drupal` - build project files (Excludes React Library)

Drupal Folder Structure:

```
my-module/
  css/
  js/
  react-component/
```

Contents of this repository should go inside the `react-component/` folder so that when `yarn drupal` executes the bundled files are copied to the correct `css/` and `js/` folders.


## Rendering the component

This React component will render inside an element with a class name of `clas-isearch-view`. The component requires the following options:

| Parameter     |  Options |
| ------------- | :------|
| data-config      | A JSON object with configuration options |


Example:

```html
<div class="clas-isearch-view" data-config='{"type":"customList", "defaultPhoto":"https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png", "testURL":"https://asudir-solr.asu.edu/asudir/directory/select?","displayType":"classic","ids":["kbeyer2","tkilbour","ckyriaka","rmkaw"],"sourceIds":[1409,1409,1409,1409],"classicOptionPhoto":false,"classicOptionTitle":false,"classicOptionDescription":false,"classicOptionEmail":false,"classicOptionPhone":false}'></div>
```
