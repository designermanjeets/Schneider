"use strict";

angular.module('conext_gateway.change_password').directive('passwordErrors',
  [
  function() {
    return {
      restrict: 'E',
      templateUrl: 'app/change_password/password_errors.html',
    }
  }
])
