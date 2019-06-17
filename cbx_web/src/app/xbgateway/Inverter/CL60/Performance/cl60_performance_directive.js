"use strict";

angular.module('conext_gateway.xbgateway').directive('cl60Performance', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Inverter/CL60/Performance/cl60_performance.html",
    controller: 'cl60statusController',
  };
}]);
