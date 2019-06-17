"use strict";

angular.module('conext_gateway.devices').controller("DetectionController",
  ["$scope", 'detectionService', 'detectionValidationService', '$uibModal',
  'deviceService', '$log', 'formSuccessMessageService',
  function ($scope, detectionService, detectionValidationService, $uibModal,
    deviceService, $log, formSuccessMessageService) {
    $scope.forms = {};
    $scope.successMessage = {};

    initDetectionResults();

    detectionService.getDeviceRangeDefinitions().then(
      function (data) {
        $scope.rangeDefinitions = data;
      },
      function(error) {
        $log.error(error);
      });

    $scope.detectionRanges = {
      BUS1_AUTODETECT_ADDR_START: null,
      BUS1_AUTODETECT_ADDR_END: null,
      BUS2_AUTODETECT_ADDR_START: null,
      BUS2_AUTODETECT_ADDR_END: null
    };

    ///////////////////////////////////////
    // Event handlers for range definition
    $scope.applyNewRanges = function () {
      formSuccessMessageService.hide($scope, 'modbusIdRange');
      detectionValidationService.validateRangeDefinition($scope.rangeDefinitions, $scope.forms.modbusIdRange);

      if ($scope.forms.modbusIdRange.$valid) {
        detectionService
          .setDeviceRangeDefinitions($scope.rangeDefinitions)
          .then(function() {
            formSuccessMessageService.show($scope, 'modbusIdRange');
          })
      }
    };

    $scope.cancelNewRanges = function () {
      detectionService.getDeviceRangeDefinitions().then(function (data) {
        $scope.rangeDefinitions = data;
        $scope.forms.modbusIdRange.$rollbackViewValue();
        $scope.forms.modbusIdRange.$setPristine();
      },
      function(error) {
        $log.error(error);
      });
    };

    ///////////////////////////////////////
    // Event handlers for device detection
    $scope.launchDeviceDetection = function () {
      detectionValidationService.validateDeviceDetection($scope.detectionRanges, $scope.forms.detectDevices);
      initDetectionResults();
      if ($scope.forms.detectDevices.$valid) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/devices/detection/detection_modal.html',
          controller: 'DetectionModalController',
          resolve: {
            detectionRanges: function () {
              return $scope.detectionRanges;
            }
          },
          backdrop: 'static',
          keyboard: false
        });

        modalInstance.result.then(
          // On success
          function (result) {
            if (result.bus1Count) {
              $scope.detectionResults.bus1Count = result.bus1Count;
            }
            if (result.bus2Count) {
              $scope.detectionResults.bus2Count = result.bus2Count;
            }
            $scope.detectionResults.unknownDevices = result.unknownDevices;
          },
          // On error
          function (error) {
            $log.error(error);
          }
        );
      }
    };

    //function refreshDevices() {
    //  deviceService.getDevices().then(function (data) {
    //    $scope.$parent.devices = data;
    //    // Join the software builds together into one string
    //    $scope.$parent.devices.inverters.forEach(function (inverter) {
    //      inverter.SoftwareBuild =
    //        [inverter.SoftwareBuildA, inverter.SoftwareBuildB, inverter.SoftwareBuildC]
    //        .filter(function (build) { return build !== undefined && build !== null && build !== "" })
    //        .join(",");
    //    });

    //  },
    //  function(error) {
    //    $log.error(error);
    //  });
    //}

    function initDetectionResults() {
      $scope.detectionResults = {
        bus1Count: {
          inverterCount: null,
          meterCount: null,
          sensorCount: null,
          unknownInvertersCount: null,
          unknownMetersCount: null,
          unknownSensorsCount: null,
          unknownDeviceCount: null,
          unknownDevices: [],
          totalCount: null
        },
        bus2Count: {
          inverterCount: null,
          meterCount: null,
          sensorCount: null,
          unknownInvertersCount: null,
          unknownMetersCount: null,
          unknownSensorsCount: null,
          unknownDeviceCount: null,
          unknownDevices: [],
          totalCount: null
        }
      };
    }
  }
]);
