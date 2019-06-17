"use strict";

angular.module('conext_gateway.xbgateway').directive('mpptPerformance', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Charger/Performance/charger_performance.html",
    controller: 'chargerStatusController',
  };
}]);
