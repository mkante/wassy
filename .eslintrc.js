module.exports = {
  extends: 'airbnb-base',
  globals: {
    API_HOST: true,
  },
  rules: {
    'arrow-body-style': ["error", "always"],
    'no-param-reassign': 0,
    'no-unneeded-ternary': 0,
    'no-underscore-dangle': 0,
    'prefer-template': 0,
    'consistent-return': 0,
    'class-methods-use-this': 0,
  },
  env: {
    node: true,
    mocha: true,
    jasmine: true,
  }
};