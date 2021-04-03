const airbnb = require('@neutrinojs/airbnb');
const reactComponents = require('@neutrinojs/react-components');
const jest = require('@neutrinojs/jest');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    process.env.NODE_ENV === 'development' ? airbnb() : false,
    reactComponents(),
    jest(),
    neutrino => {
      neutrino.config.externals({
        react: 'React',
        'react-dom': 'ReactDOM',
      });
    },
  ],
};
