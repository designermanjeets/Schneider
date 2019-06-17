"use strict";

angular.module('conext_gateway.xbgateway').directive('cswStatus', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/InverterCharger/CSW/Status/csw_status.html",
    controller: 'cswstatusController',
  };
}]);
