"use strict";

angular.module('conext_gateway.xbgateway').directive('cl25Status', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Inverter/CL25/Status/cl25_status.html",
    controller: 'cl25statusController',
  };
}]);
