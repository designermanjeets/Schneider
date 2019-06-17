"use strict";
// Error & warning icons for the device table

// was: devicesAlarms
angular.module('conext_gateway.devices').directive('alarmIcons', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/devices/alarm_icons/alarm_icons.html",
    controller: "AlarmIconsController",
    scope: {
      hasAlarms: '@',
      hasWarnings: '@',
      deviceIsPresent: '@',
    },
  };
}]);
