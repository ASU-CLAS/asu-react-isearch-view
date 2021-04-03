import faker from 'faker';

import {IsearchCircleView} from '.';

export default {
  title: 'iSearch/CircleView',
  component: IsearchCircleView,
};

const Template = args => (
  <div role="main" className="main-container container js-quickedit-main-content">
    <div className="row">
      <section className="col-lg-8 col-12 node-type-page container" aria-label="Main content">
        <div className="main-content-wrapper ">
          <div className="container pt-3">
            <div className="row">
              <div className="col col-8">
                <div className="clas-isearch-view">
                  <IsearchCircleView {...args} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  circleHover: true,
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
};
