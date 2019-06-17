"use strict";

angular.module('conext_gateway.xbgateway').directive('cl60Status', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Inverter/CL60/Status/cl60_status.html",
    controller: 'cl60statusController',
  };
}]);
