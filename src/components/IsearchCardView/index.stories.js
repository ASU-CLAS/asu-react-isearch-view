import faker from "faker";

import { IsearchCardView } from ".";

export default {
  title: "iSearch/CardView",
  component: IsearchCardView,
};

const Template = args => (
  <div className="container pt-3">
    <div class="row">
      <div class="col col-8">
        <div class="clas-isearch-view">
          <IsearchCardView {...args} />
        </div>
      </div>
    </div>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  circlesHover: true,
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