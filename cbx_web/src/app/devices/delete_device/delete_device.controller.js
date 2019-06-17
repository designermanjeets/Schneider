"use strict";

angular.module('conext_gateway.devices').controller("DeleteDeviceController", [
  "$scope", "deleteDeviceService",
  function ($scope, deleteDeviceService) {
    $scope.deleteDevice = function () {
      deleteDeviceService.startDeletion($scope.deviceInfo);
    }
  }
]);
