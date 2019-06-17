"use strict";

angular.module('conext_gateway.devices').controller("devicesController", [
  "$scope", "$location", "deviceService",
  "$interval", "$log", "unitFormatterService", "startsWith",
  function ($scope, $location, deviceService,
    $interval, $log, unitFormatterService, startsWith) {
    $scope.isInvertersCollapsed = true;
    $scope.isMetersCollapsed = true;
    $scope.isSensorsCollapsed = true;
    $scope.loadComplete = false;
    var requestPending = false;

    refreshDevices();
    // Set which item is expanded, based on the path
    function onLocationChange() {
      var path = $location.path();

      $scope.isInvertersCollapsed = !startsWith(path, '/devices/inverters');
      $scope.isMetersCollapsed = !startsWith(path, '/devices/meters');
      $scope.isSensorsCollapsed = !startsWith(path, '/devices/sensors');
    }
    $scope.$on('$locationChangeSuccess', onLocationChange);
    onLocationChange();

    var interval = $interval(function () {
      if (!requestPending) {
        requestPending = true;
        refreshDevices();
      }
    }, 60000);

    $scope.refreshDevices = function () {
      refreshDevices();
    }

    function refreshDevices() {
      deviceService.getDevices().then(function (data) {
        if ($scope.$parent !== null) {
          $scope.$parent.checkForConfiguration(data);
        }
        $scope.devices = data;

        $scope.units = {
          inverter: deviceService.getInverterUnits($scope.devices.inverters),
          meter: deviceService.getMeterUnits($scope.devices.meters),
        }

        $scope.loadComplete = true;
        requestPending = false;
      },
      function (error) {
        $log.error(error);
        $log.error("failed to refresh data");
        requestPending = false;
      });
    }

    var dereg = $scope.$on("$destroy", function () {
      if (interval) {
        $interval.cancel(interval);
        requestPending = false;
        dereg();
      }
    });
  }
]);
