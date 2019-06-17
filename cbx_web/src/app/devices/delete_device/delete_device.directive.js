"use strict";

angular.module('conext_gateway.devices').directive('deleteDevice', [function () {
  return {
    restrict: 'E',
    templateUrl: "app/devices/delete_device/delete_device.html",
    controller: "DeleteDeviceController",
    scope: {
      deviceInfo: '='
    },
  };
}]);
