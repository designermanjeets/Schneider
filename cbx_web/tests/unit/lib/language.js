"use strict";

// Library functions for use in the tests

// See https://angular-translate.github.io/docs/#/guide/22_unit-testing-with-angular-translate
function setupTranslation(moduleName) {
  var $httpBackend;

  beforeEach(module(moduleName, function ($translateProvider) {
    var dataFile = "www/hmi/i18n/en.json";
    var translations = readJSON(dataFile);
    $translateProvider.translations('en', translations);
  }));
}

