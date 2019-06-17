"use strict";

angular.module('conext_gateway.devices').directive('meterTable', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/devices/overview_tables/meter_table.html",
    controller: "MeterTableController",
    scope: {
      meters: '=',
      hasScrollBar: '=',
      units: '='
    },
  };
}]);
