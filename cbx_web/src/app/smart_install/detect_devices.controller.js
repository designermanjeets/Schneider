/* eslint angular/angularelement:0 */
"use strict";

angular.module('conext_gateway.smart_install').controller('smartInstallDetectDevicesController', [
  "$scope",
  "csbQuery",
  "$window",
  "$interval",
  "detectionService",
  "$log",
  "$state",
  function ($scope, csbQuery, $window, $interval, detectionService, $log, $state) {
    $scope.range = {
      txtDetectionStartRange: 1,
      txtDetectionEndRange: 247
    };
    $scope.performingDetection = 0;
    $scope.InverterPortA = "N/A";
    $scope.InverterPortB = "N/A";
    $scope.MeterPortA = "N/A";
    $scope.MeterPortB = "N/A";
    $scope.SensorPortA = "N/A";
    $scope.SensorPortB = "N/A";
    $scope.UnknownPortA = "N/A";
    $scope.UnknownPortB = "N/A";
    $scope.detectionProgressStatus = "0%";
    var detectionRanges = {
    };
    var detectionProgressStatus = null;

    csbQuery.getObj("TOTAL/DEVICE/COUNT/PORTA,TOTAL/DEVICE/COUNT/PORTB").then(function (data) {
      if (!($window.sessionStorage.getItem("Step3StatusApp") === "success" || $window.sessionStorage.getItem("Step3StatusApp") === "Failed" || (parseInt(data.TOTAL_DEVICE_COUNT_PORTA + data.TOTAL_DEVICE_COUNT_PORTB)) > 0)) { // TODO:
        // or
        // if a
        // device
        // has
        // been
        // detected
        // before
        $("#btnSmrtDevDetNextApp").attr("disabled", "disabled");
      }
    },
    function (error) {
      $log.error("Failed to get device count");
    });

    $scope.validateDetectionRange = function () {
      if (($scope.range.txtDetectionStartRange === undefined) || ($scope.range.txtDetectionEndRange === undefined)) {
        return true;
      }

      return parseInt($scope.range.txtDetectionStartRange, 10) < parseInt($scope.range.txtDetectionEndRange, 10);
    };

    $scope.nextClicked = function () {
      //$window.location.href = "/#/smart_install_test_conext_insight";
      $state.go('^.test_conext_insight');
    };

    $scope.skipClicked = function () {
      $window.sessionStorage.setItem("Step3StatusApp", "skipped");
      //$window.location.href = "/#/smart_install_test_conext_insight";
      $state.go('^.test_conext_insight');
    };

    $scope.startDeviceDetection = function (invalid) {
      if (invalid) {
        return;
      }
      $scope.InverterPortA = "N/A";
      $scope.InverterPortB = "N/A";
      $scope.MeterPortA = "N/A";
      $scope.MeterPortB = "N/A";
      $scope.SensorPortA = "N/A";
      $scope.SensorPortB = "N/A";
      $scope.UnknownPortA = "N/A";
      $scope.UnknownPortB = "N/A";
      $scope.detectionProgressStatus = "0%";
      $scope.performingDetection = 1;

      detectionRanges = {
        BUS1_AUTODETECT_ADDR_START: parseInt($scope.range.txtDetectionStartRange),
        BUS1_AUTODETECT_ADDR_END: parseInt($scope.range.txtDetectionEndRange),
        BUS2_AUTODETECT_ADDR_START: parseInt($scope.range.txtDetectionStartRange),
        BUS2_AUTODETECT_ADDR_END: parseInt($scope.range.txtDetectionEndRange)
      };

      detectionService.startDeviceDetection(detectionRanges).then(function () {
        detectionProgressStatus = $interval(function () {
          detectionService.getDetectionProgress(detectionRanges).then(function (data) {

            $scope.detectionProgressStatus = data + '%';
            if (parseInt($scope.detectionProgressStatus) === 100) {
              stopDetectionProgress();
            }
          },
          function (error) {
            $log.error("Failed to get detection Progress");
          });
        }, 1000);
      },
      function (error) {
        $log.error("Failed to start device detection");
      });
    };

    $scope.stopDeviceDetection = function () {
      stopDetectionProgress();
    };

    function stopDetectionProgress() {
      getDetectedDeviceCount(detectionRanges).then(function() {
        $scope.performingDetection = 0;
        csbQuery.setFromObject({ "DEVICEDETECTION.REQUEST": 0 }, true);
        $interval.cancel(detectionProgressStatus);
        detectionService.stopDeviceDetection(detectionRanges);
        var totalDeviceDetected = $scope.InverterPortA + $scope.InverterPortB + $scope.MeterPortA + $scope.MeterPortB + $scope.SensorPortA + $scope.SensorPortB + $scope.UnknownPortA + $scope.UnknownPortB;
        if (totalDeviceDetected > 0) {
          $window.sessionStorage.setItem("Step3StatusApp", "success");
        } else {
          $window.sessionStorage.setItem("Step3StatusApp", "nodevices");
        }
        $("#btnSmrtDevDetNextApp").removeAttr("disabled");

      },
      function() {
        $window.sessionStorage.setItem("Step3StatusApp", "Failed");
      });
    }

    function getDetectedDeviceCount(addressRange) {
      return detectionService.getTotalDeviceCount(addressRange).then(function (data) {
        $scope.InverterPortA = data.bus1Count.inverterCount;
        $scope.MeterPortA = data.bus1Count.meterCount;
        $scope.SensorPortA = data.bus1Count.sensorCount;
        $scope.UnknownPortA = data.bus1Count.unknownDevices.length;
        $scope.InverterPortB = data.bus2Count.inverterCount;
        $scope.MeterPortB = data.bus2Count.meterCount;
        $scope.SensorPortB = data.bus2Count.sensorCount;
        $scope.UnknownPortB = data.bus2Count.unknownDevices.length;
      },
      function (error) {
        $log.error(error);
      });

    }

  }]);
