"use strict";

angular.module('conext_gateway.devices').directive('sensorTable', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/devices/overview_tables/sensor_table.html",
    controller: "SensorTableController",
    scope: {
      sensors: '=',
      hasScrollBar: '=',
    },
  };
}]);
