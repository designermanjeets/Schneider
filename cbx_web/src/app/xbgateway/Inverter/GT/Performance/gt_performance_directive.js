"use strict";

angular.module('conext_gateway.xbgateway').directive('gtPerformance', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Inverter/GT/Performance/gt_performance.html",
    controller: 'gtstatusController',
  };
}]);
