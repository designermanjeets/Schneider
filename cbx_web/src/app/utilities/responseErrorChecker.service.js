"use strict";

// After a form has been submitted, show a success message for a certain
// period of time.
angular.module('conext_gateway.utilities').factory('responseErrorCheckerService',
  [function () {
    var service = {
      hasError: hasError
    };

    return service;

    function hasError(response) {
      var result = false;
      var data = response.data;

      if (data.results !== undefined && data.results !== null) {
        return false;
      }

      if (data === undefined || data === null || data.values === undefined || data.values === null) {
        return true;
      }

      angular.forEach(data.values, function (value, key) {
        if (value.result === undefined || value.result !== 0) {
          result = true;
        }
      });
      return result;
    }
  }
]);
