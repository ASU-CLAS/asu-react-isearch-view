import faker from 'faker';

import {IsearchListView} from '.';

// import '../../../public/bootstrap-asu.css';
import '@asu/unity-bootstrap-theme/dist/css/unity-bootstrap-theme.css'

export default {
  title: 'iSearch/ListView',
  component: IsearchListView,
};

const Template = args => (
  <div className="container pt-3">
    <div className="row">
      <div className="col col-12">
        <div className="clas-isearch-view">
          <IsearchListView {...args} />
        </div>
      </div>
    </div>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  loaded: true,
  eid: 1234,
  addressLine1: faker.address.streetAddress(),
  addressLine2: faker.address.secondaryAddress(),
  photoUrl: faker.image.avatar(),
  displayName: faker.name.findName(),
  selectedDepTitle: faker.name.jobTitle(),
  shortBio: faker.lorem.paragraph(),
  emailAddress: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  listConfig: {
    showBio: true,
    defaultPhoto: 'https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
    showEmail: true,
    showPhone: true,
    showPhoto: true,
    showTitle: true,
  }
};
