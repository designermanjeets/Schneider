"use strict";

angular.module('conext_gateway.setup').controller("gatewayInfoController", ['gatewayInfoService', '$scope', 'NDASH', '$log',
 'queryStorageService', 'systemInfoService',
  function (gatewayInfoService, $scope, NDASH, $log, queryStorageService, systemInfoService) {
    $scope.isLoaded = false;

    $scope.getLog = function() {
      queryStorageService.getVars();
    };

    $scope.getSystemInfo = function() {
      systemInfoService.getSystemInfo();
    };

    gatewayInfoService.getGatewayInfo().then(function (data) {
      $scope.info = data;
      $scope.info.loggingStatus = gatewayInfoService.getLoggingStatus(data);
      $scope.info.estimatedTimeToFill = gatewayInfoService.getEstimatedTimeToFill(data);

      $scope.info.sdCardPercent =
        ($scope.info.SDCARD_USED / $scope.info.SDCARD_SIZE) * 100;
      $scope.info.showSdGraph = true;

      if (data.SDCARD_PRESENT === 0 || data.DATALOGGER_OPSTATE === 2) {
        $scope.info.SDCARD_SIZE   = NDASH;
        $scope.info.SDCARD_USED   = NDASH;
        $scope.info.sdCardPercent = NDASH;
        $scope.info.showSdGraph   = false;
      }
      $scope.isLoaded = true;
    },
    function(error) {
      $log.error("Failed to retreive conext_gateway info");
    });


  }


]);
