"use strict";

angular.module('conext_gateway.xbgateway').directive('xwPerformance', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/InverterCharger/XW/Performance/xw_performance.html",
    controller: 'xwstatusController',
  };
}]);
