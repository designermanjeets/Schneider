"use strict";

angular.module('conext_gateway.xbgateway').directive('agsStatus', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Other/AGS/Status/ags_status.html",
    controller: 'agsstatusController',
  };
}]);
