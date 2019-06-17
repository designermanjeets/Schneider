var jsFiles = require('./javascript-sources.json');
jsFiles.push('node_modules/karma-read-json/karma-read-json.js');
// Load test libraries before everything else.
jsFiles.push('tests/unit/lib/*.js');
jsFiles.push('tests/unit/**/*.js');
jsFiles.push({pattern: 'tests/unit/**/*.json', included: false});
jsFiles.push({pattern: 'www/hmi/app/**/*.json', included: false});
jsFiles.push({pattern: 'www/hmi/i18n/en.json', included: false});

//console.log(JSON.stringify(jsFiles));

module.exports = function (config) {
  config.set({
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
