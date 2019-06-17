"use strict";

angular.module('conext_gateway.xbgateway').directive('xwStatus', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/InverterCharger/XW/Status/xw_status.html",
    controller: 'xwstatusController',
  };
}]);
