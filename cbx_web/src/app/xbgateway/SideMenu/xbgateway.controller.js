
"use strict";

angular.module('conext_gateway.xbgateway').controller("xbgatewayController", [
  "$rootScope", "$scope", "moment", "$filter", "$location", "xbgatewayService",
  "$interval", "$log", "unitFormatterService", "startsWith", "deviceService", "$q",
  function($rootScope, $scope, moment, $filter, $location, xbgatewayService,
    $interval, $log, unitFormatterService, startsWith, deviceService, $q) {
    $scope.isInvertersCollapsed = true;
    $scope.isMetersCollapsed = true;
    $scope.isSensorsCollapsed = true;
    $scope.isChargersCollapsed = true;
    $scope.isInverterChargersCollapsed = true;
    $scope.isOtherDevicesCollapsed = true;
    $scope.loadComplete = false;
    $scope.inverters = [];
    $scope.chargers = [];
    $scope.inverterChargers = [];
    $scope.otherDevices = [];

    var requestPending = false;

    refreshDevices();

    // Set which item is expanded, based on the path
    function onLocationChange() {
      var path = $location.path();
      $scope.isChargersCollapsed = !startsWith(path, '/xbgateway/xbdevlist/chg');
      $scope.isInvertersCollapsed = !startsWith(path, '/xbgateway/xbdevlist/inverter');
      $scope.isInverterChargersCollapsed = !startsWith(path, '/xbgateway/xbdevlist/invchg');
      $scope.isOtherDevicesCollapsed = !startsWith(path, '/xbgateway/xbdevlist/oth');
      $scope.isMetersCollapsed = !startsWith(path, '/xbgateway/xbdevlist/meters');
      $scope.isSensorsCollapsed = !startsWith(path, '/xbgateway/xbdevlist/sensors');

    }

    $scope.$on('$locationChangeSuccess', onLocationChange);
    onLocationChange();

    var interval = $interval(function() {
      if (!requestPending) {
        requestPending = true;
        refreshDevices();
      }
    }, 60000);

    $scope.refreshDevices = function() {
      refreshDevices();
    }



    function sortDevice(device) {
      switch (device.name) {
        case 'GT':
        case 'CL36':
        case 'CL60':
        case 'CL25':
          $scope.inverters.push(device);
          break;

        case 'XW':
        case 'CSW':
        case 'FSW':
          $scope.inverterChargers.push(device);
          break;

        case 'HVMPPT':
        case 'MPPT':
          $scope.chargers.push(device);
          break;

        case 'IEM32XX':
        case 'PM2XXX':
        case 'EM3500':
        case 'PM8XX':
        case 'PM32XX':
          $scope.meters.push(device);
          break;

        case 'AGS':
        case 'SCP':
        case 'BATTMON':
        default:
          if (device.FGA !== "unknown" && device.name !== "unknown") {
            $scope.otherDevices.push(device);
          }
          break;
      }
    }

    function refreshDevices() {
      $scope.meters = [];
      $scope.sensors = [];
      xbgatewayService.getDevices().then(function(data) {
        processXanbusData(data);
        //processModbusData(data.modbusData);
        $scope.loadComplete = true;
        requestPending = false;
      }, function(error) {
        $log.error(error);
        $log.error("failed to refresh data");
        requestPending = false;
      });
    }

    function processXanbusData(data) {
      $scope.devices = data.DEVLIST;
      $scope.inverters = [];
      $scope.chargers = [];
      $scope.inverterChargers = [];
      $scope.otherDevices = [];
      $scope.devices.map(sortDevice);
    }

    function processModbusData(data) {
      if ($scope.$parent !== null) {
        $scope.$parent.checkForConfiguration(data);
      }
      Array.prototype.push.apply($scope.inverters, data.inverters);
      $scope.meters = data.meters;
      $scope.sensors = data.sensors;

      $scope.units = {
        inverter: deviceService.getInverterUnits(data.inverters),
        meter: deviceService.getMeterUnits(data.meters),
      };
    }


    var dereg = $scope.$on("$destroy", function() {
      if (interval) {
        $interval.cancel(interval);
        requestPending = false;
        dereg();
      }
    });
  }
]);
