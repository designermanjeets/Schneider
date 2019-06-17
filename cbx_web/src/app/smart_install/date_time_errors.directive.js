"use strict";

angular.module('conext_gateway.smart_install').directive('dateTimeErrors',
  [
  function() {
    return {
      restrict: 'E',
      templateUrl: 'app/smart_install/date_time_errors.html',
    }
  }
])
