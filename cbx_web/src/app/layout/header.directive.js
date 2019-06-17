"use strict";

angular.module('conext_gateway.layout').directive('headerInformation', [function () {
  return {
    restrict: 'AE',
    templateUrl: "app/layout/header.html",
    controller: "headerController"
  };
}]);
