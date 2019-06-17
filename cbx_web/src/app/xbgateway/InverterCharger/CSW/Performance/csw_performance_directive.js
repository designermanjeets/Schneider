"use strict";

angular.module('conext_gateway.xbgateway').directive('cswPerformance', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/InverterCharger/CSW/Performance/csw_performance.html",
    controller: 'cswstatusController',
  };
}]);
