"use strict";

angular.module('conext_gateway.devices').controller("SensorsController", [
  "$scope", "$stateParams", "$filter", function ($scope, $stateParams, $filter) {
    if ($stateParams.obj) {
      $scope.message = $filter('translate')('devices.delete_device.delete_message', { 'deviceName': $stateParams.obj.name });
      $scope.closeMessage = function() {
        $scope.message = null;
      }
    }


  }
]);
