"use strict";

angular.module('conext_gateway.xbgateway').directive('batmonStatus', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/xbgateway/Other/BATMON/Status/batmon_status.html",
  };
}]);
