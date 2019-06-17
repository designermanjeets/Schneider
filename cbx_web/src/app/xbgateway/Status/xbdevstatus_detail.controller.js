"use strict";

angular.module('conext_gateway.xbgateway').controller("xbdevStatusDetailController", ["$scope", "$stateParams", "$log", "$interval",
  "xbdevlistService", "statusQueryService", "statusService", "temperatureService",
  function($scope, $stateParams, $log, $interval, xbdevlistService, statusQueryService, statusService, temperatureService) {
    $scope.loadComplete = false;
    $scope.device = $stateParams.device;
    $scope.id = $stateParams.id;

    var requestPending = false;
    var interval;
    var configData;
    $scope.statusSysvars = [];
    var stsSysVars = getSysVarsInfo($stateParams.device, $stateParams.id);

    // Retreives the sysvar meta data, device and the the details for all
    // the devices
    xbdevlistService.getConfig().then(function(config) {
      configData = config;
      refreshStatusSysvars($scope.device);

      interval = $interval(function() {
        if (!requestPending) {
          requestPending = true;
          refreshStatusSysvars($scope.device);
        }
      }, 3000);
    });

    $scope.tempUnit = "°" + temperatureService.getTemperatureType();

    // Obtain all the status sysvars to be retrieved.
    function getSysVarsInfo(device, instanceID) {
      var sysVars;
      switch (device) {
        case "MPPT":
          sysVars = statusQueryService.getMPPTStatusSysvars(instanceID);
          break;
        case "HVMPPT":
          sysVars = statusQueryService.getHVMPPTStatusSysvars(instanceID);
          break;
        case "CSW":
          sysVars = statusQueryService.getCSWStatusSysvars(instanceID);
          break;
        case "AGS":
          sysVars = statusQueryService.getAGSStatusSysvars(instanceID);
          break;
        case "SCP2":
          sysVars = statusQueryService.getSCP2StatusSysvars(instanceID);
          break;
        case "SCP":
          sysVars = statusQueryService.getSCPStatusSysvars(instanceID);
          break;
        case "BATTMON":
          sysVars = statusQueryService.getBATTMONStatusSysvars(instanceID);
          break;
        case "XW":
          sysVars = statusQueryService.getXWStatusSysvars(instanceID);
          break;
        case "GT":
          sysVars = statusQueryService.getGTStatusSysvars(instanceID);
          break;
        case "CL25":
          sysVars = statusQueryService.getCL25StatusSysvars(instanceID);
          break;
        case "CL36":
          sysVars = statusQueryService.getCL36StatusSysvars(instanceID);
          break;
        case "CL60":
          sysVars = statusQueryService.getCL60StatusSysvars(instanceID);
          break;
        case "EM3500":
          sysVars = statusQueryService.getEM3500StatusSysvars(instanceID);
          break;
        case "PM2XXX":
          sysVars = statusQueryService.getPM2XXXStatusSysvars(instanceID);
          break;
        case "PM8XX":
          sysVars = statusQueryService.getPM8XXStatusSysvars(instanceID);
          break;
        case "PM32XX":
          sysVars = statusQueryService.getPM32XXStatusSysvars(instanceID);
          break;
        case "IEM32XX":
          sysVars = statusQueryService.getIEM32XXStatusSysvars(instanceID);
          break;
        default:
          break;
      }
      return sysVars;
    }

    // Retrieve status sysvars once.
    function refreshStatusSysvars() {
      var svResults = [];
      if (stsSysVars instanceof Array) {
        statusService.getStatusSysvars(stsSysVars, configData).then(function(data) {
          $scope.statusSysvars = data;
          requestPending = false;
          $scope.loadComplete = true;
        }, function(error) {
          $log.error(error);
          requestPending = false;
        });
      } else {
        requestPending = false;
      }
    }

    /* delete the interval timer when we exit the page */
    var dereg = $scope.$on("$destroy", function() {
      if (interval) {
        $interval.cancel(interval);
        requestPending = false;
        dereg();
      }
    });
  }
]);
