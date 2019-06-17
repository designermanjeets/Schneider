"use strict";

angular.module('conext_gateway.xbgateway').directive('mpptStatus', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Charger/Status/charger_status.html",
    controller: 'chargerStatusController',
  };
}]);
