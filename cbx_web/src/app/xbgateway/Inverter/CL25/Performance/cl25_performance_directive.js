"use strict";

angular.module('conext_gateway.xbgateway').directive('cl25Performance', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Inverter/CL25/Performance/cl25_performance.html",
    controller: 'cl25statusController',
  };
}]);
