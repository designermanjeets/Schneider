"use strict";

angular.module('conext_gateway.devices').directive('inverterTable', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/devices/overview_tables/inverter_table.html",
    controller: "InverterTableController",
    scope: {
      inverters: '=',
      hasScrollBar: '=',
      units: '='
    },
  };
}]);
