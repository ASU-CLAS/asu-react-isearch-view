import faker from 'faker';

import {IsearchCardView} from '.';

import '../../../public/bootstrap-asu.css';

export default {
  title: 'iSearch/CardView',
  component: IsearchCardView,
};

const Template = args => (
  <div className="container"><div className="row"><div className="col col-sm-4">
  <div className="clas-isearch-view">
    <IsearchCardView {...args} />
  </div>
  </div></div></div>
);

export const Basic = Template.bind({});
Basic.args = {
  defaultPhoto:
    'https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
  loaded: true,
  eid: 1234,
  photoUrl: faker.image.avatar(),
  displayName: faker.name.findName(),
  selectedDepTitle: faker.name.jobTitle(),
  shortBio: faker.lorem.paragraph(),
  emailAddress: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  showDescription: true,
  showEmail: true,
  showPhone: true,
  showPhoto: true,
  showTitle: true,
  showExpertise: true
};

export const DefaultPhoto = Template.bind({});
DefaultPhoto.args = {
  defaultPhoto:
    'https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png',
  loaded: true,
  eid: 1234,
  displayName: faker.name.findName(),
  selectedDepTitle: faker.name.jobTitle(),
  shortBio: faker.lorem.paragraph(),
  emailAddress: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  expertiseAreas: faker.datatype.array(),
  showDescription: true,
  showEmail: true,
  showPhone: true,
  showPhoto: true,
  showTitle: true,
  showExpertise: true
};
