"use strict";

angular.module('conext_gateway.xbgateway').directive('cl36Status', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Inverter/CL36/Status/cl36_status.html",
    controller: 'cl36statusController',
  };
}]);
