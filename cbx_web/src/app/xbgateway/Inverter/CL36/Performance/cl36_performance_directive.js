"use strict";

angular.module('conext_gateway.xbgateway').directive('cl36Performance', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Inverter/CL36/Performance/cl36_performance.html",
    controller: 'cl36statusController',
  };
}]);
