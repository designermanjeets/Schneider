"use strict";

angular.module('conext_gateway.layout').directive('updateTitle', ['$rootScope', '$timeout', '$translate',
  function ($rootScope, $timeout, $translate) {
    return {
      link: function (scope, element) {
        var handle = null;

        var listener = function (event, toState) {

          var title = 'titles.main_title';
          if (toState.data && toState.data.pageTitle) {
            title = toState.data.pageTitle;
          }

          $timeout(function () {
            $translate(title).then(function(data) {
              element.text(data);
            });
          }, 0, false);
        };

        handle = $rootScope.$on('$stateChangeStart', listener);
        scope.urlChangeHandler = handle;

      }
    };
  }
]);
