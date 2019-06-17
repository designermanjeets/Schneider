"use strict";

angular.module('conext_gateway.devices').controller("DeleteDeviceModalController", [
  "$scope", "deleteDeviceService", "$uibModalInstance", "$state", "deviceInfo",
  function ($scope, deleteDeviceService, $uibModalInstance, $state, deviceInfo) {
    $scope.deviceName = deviceInfo.name;
    $scope.deleteDevice = function () {
      deleteDeviceService.deleteDevice(deviceInfo.bus, deviceInfo.address).then(function () {
        $uibModalInstance.close();
        $state.go("xbgateway.xbdevlist", { type: 'all'});
      },
      function (error) {
      });
    };

    $scope.close = function () {
      $uibModalInstance.close();
    };
  }
]);
