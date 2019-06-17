"use strict";

angular.module('conext_gateway.devices').directive('inverterTableContent', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/devices/overview_tables/inverter_table_content.html",

    scope: {
      inverters: '=',
      hasScrollBar: '=',
      units: '=',

      // inverter-comparison or device-table
      screen: '@',
    },

    controller: 'InverterTableContentController',
  };
}]);
