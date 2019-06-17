"use strict";

angular.module('conext_gateway.xbgateway').directive('gtStatus', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Inverter/GT/Status/gt_status.html",
    controller: 'gtstatusController',
  };
}]);
