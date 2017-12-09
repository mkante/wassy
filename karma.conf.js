module.exports = function fn(config) {
  config.set({
    frameworks: ['mocha', 'sinon-chai', 'browserify'],
    browsers: ['PhantomJS_1'],
    files: [
      'src/**/*.js',
      'test/e2e/**/*.js',
    ],
    preprocessors: {
      'src/**/*.js': ['browserify'],
      'test/e2e/**/*.spec.js': ['browserify'],
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
      },
    },
    browserify: {
      debug: true,
      transform: [
        [
          'babelify',
          {
            presets: 'es2015',
          },
        ],
      ],
    },
    singleRun: true,
    customLaunchers: {
      PhantomJS_1: {
        base: 'PhantomJS',
        options: {
          settings: {
            webSecurityEnabled: false,
            ignoreSslErrors: true,
          },
        },
        debug: true,
      },
    },
  });
};
