"use strict";

angular.module('conext_gateway.xbgateway').directive('scpStatus', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Other/SCP/Status/scp_status.html",
    controller: 'scpstatusController',
  };
}]);
