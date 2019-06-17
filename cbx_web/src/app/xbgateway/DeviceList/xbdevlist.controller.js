
"use strict";

angular.module('conext_gateway.xbgateway').controller("xbdevlistController", [
  "$scope", "$stateParams", "xbdevlistService", "$interval", "devlistQueryService", "$timeout", "$state", "imageClickService",
  function($scope, $stateParams, xbdevlistService, $interval, devlistQueryService, $timeout, $state, imageClickService) {
    var requestPending = false;
    var counter = null;
    var queryVars = [];
    var configData;
    var interval;
    $scope.display = {
      type: "3",
    };

    $scope.deviceClick = function(device) {
      imageClickService.imageClicked(device);
    };

    $scope.getDeviceCount = function() {
      var count = 0;
      switch ($scope.type) {
        case 'all':
          count += countDevices('inverterChargers');
          count += countDevices('inverters');
          count += countDevices('chargers');
          count += countDevices('other');
          count += countDevices('meters');
          break;
        case 'invchg':
          count += countDevices('inverterChargers');
          break;
        case 'inverter':
          count += countDevices('inverters');
          break;
        case 'chg':
          count += countDevices('chargers');
          break;
        case 'oth':
          count += countDevices('other');
          break;
        case 'meters':
          count += countDevices('meters');
          break;
        default:
      }
      return count;
    };

    function countDevices(deviceType) {
      var count = 0;
      if ($scope.devices && $scope.devices.hasOwnProperty(deviceType)) {
        for (var deviceIndex in $scope.devices[deviceType]) {
          if ($scope.devices[deviceType].hasOwnProperty(deviceIndex) &&
            $scope.devices[deviceType][deviceIndex].attributes.opMode !== 'Removed') {
            count++;
          }
        }
      }
      return count;
    }

    $scope.setOperating = function() {
      var devlist = $scope.devlist;
      xbdevlistService.setOperating(devlist);
    };

    $scope.setStandby = function() {
      var devlist = $scope.devlist;
      xbdevlistService.setStandby(devlist);
    };

    //This holds the value which section of the overview should be shown,  default is all
    $scope.type = $stateParams.type ? $stateParams.type : "all";

    //Scope object which holds all the information needed to render the device overview screen
    $scope.devices = {
      inverters: [],
      chargers: [],
      inverterChargers: [],
      other: [],
      meters: [],
      sensors: []
    };

    //Retreives the sysvar meta data, device and the the details for all the devices
    xbdevlistService.getConfig().then(function(config) {
      configData = config;
      getDevices();

      interval = $interval(function() {
        if (!requestPending) {
          requestPending = true;
          refreshDeviceDetails($scope.devices);
        }
      }, 3000);
    });

    //refreshed the device details and if needed, updates the device list
    function refreshDeviceDetails(devices) {
      xbdevlistService.refreshDeviceInformation(devices, queryVars, configData).then(function(currentCount) {
        if (!counter) {
          counter = currentCount;
        }
        if (counter !== currentCount) {
          counter = currentCount;
          getDevices();
        } else {
          $scope.devices = devices;
          requestPending = false;
        }
      }, function(error) {
        $scope.devices = devices;
        requestPending = false;
      });
    }

    //function to update the device object when the device list changes
    function getDevices() {
      requestPending = true;
      xbdevlistService.getDevList().then(function(data) {
        var devices = {
          inverters: [],
          chargers: [],
          inverterChargers: [],
          other: [],
          meters: [],
          sensors: []
        };
        queryVars = [];
        $scope.devlist = data.DEVLIST;
        for (var index = 0; index < data.DEVLIST.length; index++) {
          switch (data.DEVLIST[index].name) {
            case "XW":
              data.DEVLIST[index].sysVars = devlistQueryService.getXWSysvars(data.DEVLIST[index].instance);
              devices.inverterChargers.push(data.DEVLIST[index]);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "CSW":
              data.DEVLIST[index].sysVars = devlistQueryService.getCSWSysvars(data.DEVLIST[index].instance);
              devices.inverterChargers.push(data.DEVLIST[index]);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "FSW":
              data.DEVLIST[index].sysVars = devlistQueryService.getFSWSysvars(data.DEVLIST[index].instance);
              devices.inverterChargers.push(data.DEVLIST[index]);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "GT":
              data.DEVLIST[index].sysVars = devlistQueryService.getGTSysvars(data.DEVLIST[index].instance);
              devices.inverters.push(data.DEVLIST[index]);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "CL25":
              devices.inverters.push(data.DEVLIST[index]);
              data.DEVLIST[index].sysVars = devlistQueryService.getCL25Sysvars(data.DEVLIST[index].instance);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "CL60":
              devices.inverters.push(data.DEVLIST[index]);
              data.DEVLIST[index].sysVars = devlistQueryService.getCL60Sysvars(data.DEVLIST[index].instance);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "CL36":
              devices.inverters.push(data.DEVLIST[index]);
              data.DEVLIST[index].sysVars = devlistQueryService.getCL36Sysvars(data.DEVLIST[index].instance);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "MPPT":
              data.DEVLIST[index].sysVars = devlistQueryService.getMPPTSysvars(data.DEVLIST[index].instance);
              devices.chargers.push(data.DEVLIST[index]);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "HVMPPT":
              data.DEVLIST[index].sysVars = devlistQueryService.getHVMPPTSysvars(data.DEVLIST[index].instance);
              devices.chargers.push(data.DEVLIST[index]);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "BATTMON":
              data.DEVLIST[index].sysVars = devlistQueryService.getBattmonSysvars(data.DEVLIST[index].instance);
              devices.other.push(data.DEVLIST[index]);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "AGS":
              data.DEVLIST[index].sysVars = devlistQueryService.getAGSSysvars(data.DEVLIST[index].instance);
              devices.other.push(data.DEVLIST[index]);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "SCP":
              data.DEVLIST[index].sysVars = devlistQueryService.getSCPSysvars(data.DEVLIST[index]);
              devices.other.push(data.DEVLIST[index]);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "SCP2":
              devices.other.push(data.DEVLIST[index]);
              data.DEVLIST[index].sysVars = devlistQueryService.getSCPSysvars(data.DEVLIST[index]);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "EM3500":
              devices.meters.push(data.DEVLIST[index]);
              data.DEVLIST[index].sysVars = devlistQueryService.getEM3500Sysvars(data.DEVLIST[index].instance);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "IEM32XX":
              devices.meters.push(data.DEVLIST[index]);
              data.DEVLIST[index].sysVars = devlistQueryService.getIEM32XXSysvars(data.DEVLIST[index].instance);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "PM2XXX":
              devices.meters.push(data.DEVLIST[index]);
              data.DEVLIST[index].sysVars = devlistQueryService.getPM2XXXSysvars(data.DEVLIST[index].instance);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "PM32XX":
              devices.meters.push(data.DEVLIST[index]);
              data.DEVLIST[index].sysVars = devlistQueryService.getPM32XXSysvars(data.DEVLIST[index].instance);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            case "PM8XX":
              devices.meters.push(data.DEVLIST[index]);
              data.DEVLIST[index].sysVars = devlistQueryService.getPM8XXSysvars(data.DEVLIST[index].instance);
              queryVars.push.apply(queryVars, data.DEVLIST[index].sysVars);
              break;
            default:
          }
        }
        refreshDeviceDetails(devices);
      });
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
