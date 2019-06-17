var jsFiles = [];
jsFiles.push('src/*.js');
jsFiles.push('test/unit/*.js');

module.exports = function (config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    reporters: ['spec'],
    files: jsFiles,

    specReporter: {
      //maxLogLines: 5,         // limit number of lines logged per test
      //suppressErrorSummary: true,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true,  // do not print information about skipped tests
      //showSpecTiming: false // print the time elapsed for each spec
    },
  });
};
