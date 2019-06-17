"use strict";

angular.module('conext_gateway.devices').controller("InvertersController", [
  "$scope", "$stateParams", "$translate", function ($scope, $stateParams, $translate) {
    if ($stateParams.obj) {
      $translate('devices.delete_device.delete_message', { 'deviceName': $stateParams.obj.name }).then(function(translation) {
        $scope.message = translation;
      });
      $scope.closeMessage = function () {
        $scope.message = null;
      }
    }
  }
]);
