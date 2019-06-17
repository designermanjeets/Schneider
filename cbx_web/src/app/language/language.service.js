"use strict";

angular.module("conext_gateway.language").factory('languageService',
  ['$translate', 'tmhDynamicLocale',
  function ($translate, tmhDynamicLocale) {
    return {
      getCurrentLanguage : getCurrentLanguage,
      getAllLanguages : getAllLanguages,
      changeLanguage  : changeLanguage,
    };

    function getCurrentLanguage() {
      // From the docs:
      //   proposedLanguage returns the language key of language that is
      //   currently loaded asynchronously.
      //
      // So even if the language files are currently being loaded,
      // we'll still get a valid response for what the language is.
      //
      // This can also load the last-used language from a cookie.
      return $translate.proposedLanguage();
    }

    function getAllLanguages() {
      // Maintenance note: This should match the list of locales in
      // Gulpfile.js
      return [
        {
          url: "img/english_flag.png",
          value: "en",
          label: "English" ,
        },

        // {
        //   url: "img/french_flag.png",
        //   value: "fr",
        //   label: "French",
        // },

        // {
        //   url: "img/english_flag.png",
        //   value: "ff",
        //   label: "Flipped text" ,
        // },
      ];
    }

    function changeLanguage(languageKey) {
      // Set the language to use for string translations
      $translate.use(languageKey);

      // Set the angular locale. Among other things, this sets
      // date/time formats used in date pickers.
      tmhDynamicLocale.set(languageKey);
    }
  }
]);
