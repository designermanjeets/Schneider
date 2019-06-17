"use strict";

angular.module("conext_gateway.language").config(
  ['$translateProvider', 'tmhDynamicLocaleProvider',
  function ($translateProvider, tmhDynamicLocaleProvider) {

  $translateProvider.preferredLanguage('en');
  $translateProvider.useLocalStorage();
  // Log console errors if we try to access an uknown string ID
  $translateProvider.useMissingTranslationHandlerLog();

  // escapeParameters sanitizes input like this:
  // * Translated strings CAN contain HTML
  //   e.g. this is OK: "T<sub>amb</sub>"
  //
  // * Parameters to translated strings CANNOT contain HTML
  //   e.g. "Real Power {{units}}" -- HTML is escaped in the units
  //   parameter, because it may come from user input.
  //
  // See http://angular-translate.github.io/docs/#/guide/19_security
  $translateProvider.useSanitizeValueStrategy('escapeParameters');

  $translateProvider.addInterpolation('$translateMessageFormatInterpolation');

  $translateProvider.useStaticFilesLoader({
    files: [{
      prefix: '/i18n/',
      suffix: '.json',
    }],
  });

  tmhDynamicLocaleProvider.localeLocationPattern(
    "/bower_components/angular-i18n/angular-locale_{{locale}}.js");
}]);

angular.module("conext_gateway.language").run(
  ['$translate', 'tmhDynamicLocale', '$window', 'languageService',
  function($translate, tmhDynamicLocale, $window, languageService) {
    // Set the Angular locale based on the locale we stored
    // in the cookie for the $translate service
    var locale = languageService.getCurrentLanguage();
    if(locale === "" || locale === undefined) {
      locale = "en";
    }
    tmhDynamicLocale.set(locale)

    // Add a debugging hook to change language
    $window.csbChangeLanguage = function(langKey) {
      languageService.changeLanguage(langKey);
    }
  }
]);
