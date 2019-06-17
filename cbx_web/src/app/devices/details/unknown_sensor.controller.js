"use strict";

angular.module('conext_gateway.devices').controller("UnknownSensorController",
  ["$scope", "$stateParams", "$log", "$translate",
   "sensorDetailsService", "deviceService", "$state", "deleteDeviceService", "deviceNameParserService",
  function ($scope, $stateParams, $log, $translate,
    sensorDetailsService, deviceService, $state, deleteDeviceService, deviceNameParserService) {
    $scope.forms = {};
    var sensorName = $stateParams.sensorName;
    $scope.device = {};
    $scope.device.NAME = sensorName;
    $scope.device.sensorModel = null;
    $scope.sensorModels = [
         {
           id: null,
           // name: "Select" -- translated name gets filled in later
         },
         {
           id: "IMTSOLAR",
         },
    ];

    function translateSensorModels() {
      var stringIds = $scope.sensorModels.map(function(model) {
        var id = (model.id === null) ? "select" : model.id;
        return "devices.details.sensor_models." + id;
      });
      $translate(stringIds).then(function(modelNameForStringId) {
        stringIds.forEach(function(stringId, idx) {
          var modelName = modelNameForStringId[stringId];
          $scope.sensorModels[idx].name = modelName;
        });
      });
    }
    translateSensorModels();

    $scope.apply = function () {
      if ($scope.forms.sensorSettings.$valid) {
        sensorDetailsService.setUnknownDeviceType(sensorName, $scope.device.sensorModel).then(function() {
           deviceService.getDevices().then(function (data) {
             $scope.$parent.refreshDevices();
             $state.go('devices.sensors');
             },
            function (error) {
              $log.error(error);
            });

        });
      }
    };

    $scope.deleteDevice = function () {
      var device = deviceNameParserService.parseDeviceName($scope.device.NAME);
      var deviceInfo = {
        bus: device.bus,
        address: device.address,
        refresh: function () {
          $scope.$parent.refreshDevices();
        },
        type: device.deviceName.toLowerCase() + "s",
        name: $stateParams.sensorName
      }
      deleteDeviceService.startDeletion(deviceInfo);
    }

    $scope.reset = function () {
      $scope.device.sensorModel = null;
      $scope.forms.sensorSettings.$rollbackViewValue();
      $scope.forms.sensorSettings.$setPristine();
    }
  }
]);
