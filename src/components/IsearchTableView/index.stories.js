import faker from "faker";

import { IsearchTableView } from ".";

export default {
  title: "iSearch/TableView",
  component: IsearchTableView,
};

const Template = args => (
  <div className="container pt-3">
    <div class="row">
      <div class="col col-8">
        <div class="clas-isearch-view">
          <IsearchTableView {...args} />
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
    "https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
  loaded: true,
  node: {
    eid: 1234,
    photoUrl: faker.image.avatar(),
    displayName: faker.name.findName(),
    selectedDepTitle: faker.name.jobTitle(),
    shortBio: faker.lorem.paragraph(),
    emailAddress: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
  },
};

export const Classic = Template.bind({});
Classic.args = {
  classicDescription: true,
  classicEmail: true,
  classicPhone: true,
  classicPhoto: true,
  classicTitle: true,
  defaultPhoto:
    "https://thecollege.asu.edu/profiles/openclas/modules/custom/clas_isearch/images/avatar.png",
  loaded: true,
  node: {
    eid: 1234,
    photoUrl: faker.image.avatar(),
    displayName: faker.name.findName(),
    selectedDepTitle: faker.name.jobTitle(),
    shortBio: faker.lorem.paragraph(),
    emailAddress: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
  },
};
