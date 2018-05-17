// Karma configuration
// Generated on Sun Dec 10 2017 07:31:32 GMT+0000 (UTC)

module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'jasmine-ajax', 'jasmine'],
    browsers: ['PhantomJS'],

    // list of files / patterns to load in the browser
    files: [
      'src/**/*.js',
      'test/unit/**/*.js',
    ],
    preprocessors: {
      'src/**/*.js': ['browserify'],
      'test/unit/**/*.spec.js': ['browserify'],
    },
    browserify: {
      debug: true,
      transform: ['babelify'],
      plugin: ['proxyquire-universal'],
    },
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
  });
};
