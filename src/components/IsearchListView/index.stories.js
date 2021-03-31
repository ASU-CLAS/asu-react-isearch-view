import faker from 'faker';

import {IsearchListView} from '.';

export default {
  title: 'iSearch/ListView',
  component: IsearchListView,
};

const Template = args => (
  <div className="container pt-3">
    <div className="row">
      <div className="col col-8">
        <div className="clas-isearch-view">
          <IsearchListView {...args} />
        </div>
      </div>
    </div>
  </div>
);

export const Modern = Template.bind({});
Modern.args = {
  classicDescription: false,
  classicEmail: false,
  classicPhone: false,
  classicPhoto: false,
  classicTitle: false,
  defaultPhoto:
    'https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
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
};

export const Classic = Template.bind({});
Classic.args = {
  classicDescription: true,
  classicEmail: true,
  classicPhone: true,
  classicPhoto: true,
  classicTitle: true,
  defaultPhoto:
    'https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
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
};
