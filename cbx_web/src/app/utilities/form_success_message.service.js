"use strict";

// After a form has been submitted, show a success message for a certain
// period of time.
angular.module('conext_gateway.utilities').factory('formSuccessMessageService',
  ['$rootScope', '$timeout',
  function($rootScope, $timeout) {
    var SUCCESS_MESSAGE_TIME = 15 * 1000;
    var successTimeout = {};

    var dereg = $rootScope.$on('$locationChangeStart', function() {
      angular.forEach(successTimeout, function(formName, timeout) {
        if (timeout !== null) {
          $timeout.cancel(timeout);
        }
      });
      dereg();
    })

    return {
      show: function($scope, formName) {
        $scope.successMessage[formName] = true;
        successTimeout[formName] = $timeout(function() {
          $scope.successMessage[formName] = false;
          successTimeout[formName] = null;
        }, SUCCESS_MESSAGE_TIME);
      },

      hide: function($scope, formName) {
        $scope.successMessage[formName] = false;
        if (successTimeout[formName] !== null) {
          $timeout.cancel(successTimeout[formName]);
        }
      }
    };
  }
])
