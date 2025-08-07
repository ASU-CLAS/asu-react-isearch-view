import faker from 'faker';

import {IsearchTableView} from '.';

import '@asu/unity-bootstrap-theme/dist/css/unity-bootstrap-theme.css'

export default {
  title: 'iSearch/TableView',
  component: IsearchTableView,
};

const Template = args => (
  <div role="main" className="main-container container js-quickedit-main-content">
    <div className="row">
      <section className="col-12" aria-label="Main content">

        <div className="isearch-table-list">
            <table className="table">
              <tbody>
                <IsearchTableView {...args} />
              </tbody>
            </table>
        </div>

      </section>
    </div>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  loaded: true,
  eid: 1234,
  photoUrl: faker.image.avatar(),
  displayName: faker.name.findName(),
  selectedDepTitle: faker.name.jobTitle(),
  shortBio: faker.lorem.paragraph(),
  expertiseAreas: faker.datatype.array(),
  emailAddress: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  listConfig: {
    showBio: true,
    defaultPhoto: 'https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
    showEmail: true,
    showPhone: true,
    showPhoto: true,
    showTitle: true,
    showExpertise: true
  }
};
