const airbnb = require('@neutrinojs/airbnb');
const reactComponents = require('@neutrinojs/react-components');
const jest = require('@neutrinojs/jest');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    process.env.NODE_ENV === 'development' ? airbnb() : false,
    reactComponents({
      // this reconfigures the reactComponents preset to watch 'containers/'
      // for the top-level components we want to compile into the build folder.
      components: 'containers',
    }),
    jest(),
    neutrino => {
      neutrino.config.externals({
        react: 'React',
        'react-dom': 'ReactDOM',
      });
    },
  ],
};
