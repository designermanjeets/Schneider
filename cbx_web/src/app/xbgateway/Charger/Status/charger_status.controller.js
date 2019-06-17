
"use strict";

angular.module('conext_gateway.xbgateway').controller("chargerStatusController", [
  "$scope", "$stateParams", "$filter", "$location", "xbdevdetailService", "invChgStsService", "$interval", "$log", "temperatureService",
  function($scope, $stateParams, $filter, $location, xbdevdetailService, invChgStsService, $interval, $log, temperatureService) {
    $scope.loadComplete = false;
    $scope.device = $stateParams.device;
    $scope.id = $stateParams.id;

    var requestPending = false;

    /* request initial status */
    getDevStatus($scope.device, $scope.id);

    /* set up a periodic query */
    var interval = $interval(function() {
      if (!requestPending) {
        var queryID = $scope.device + $scope.id + 'sts';
        requestPending = true;
        getDevStatus($scope.device, $scope.id, queryID);
      }
    }, 1000);

    /* get the device status information */
    function getDevStatus(device, id, queryID) {

      xbdevdetailService.getDevSts(device, id, queryID).then(function(data) {
          data.DC_IN_V = (data.DC_IN_V / 1000).toFixed(1);
          data.DC_IN_I = (data.DC_IN_I / 1000).toFixed(1);
          data.DC_OUT_V = (data.DC_OUT_V / 1000).toFixed(1);
          data.DC_OUT_I = (data.DC_OUT_I / 1000).toFixed(1);
          /* take absolute values of battery current and power */
          data.DC_I_ABS = Math.abs(data.DC_I);
          data.DC_P_ABS = Math.abs(data.DC_P);
          var tempType = temperatureService.getTemperatureType();
          data.BATT_T = (data.BATT_T * 0.01) - 273;
          data.BATT_T = parseFloat(temperatureService.convert(tempType, data.BATT_T)).toFixed(1);
          data.BATT_T_UNIT = temperatureService.getUnitsString(tempType);
          $scope.data = data;
          UpdateEnergyFlow(data);

          $scope.loadComplete = true;
          requestPending = false;
        },
        function(error) {
          $log.error(error);
          $log.error("failed to refresh data");
          requestPending = false;
        });
    }

    function UpdateEnergyFlow(data) {
      var chgsts;

      chgsts = invChgStsService.GetChgSts(data);
      $scope.chgsts = chgsts.description;

      if (chgsts.charging === true) {
        $scope.energySource = chgsts.energySource;
        $scope.energyTarget = chgsts.energyTarget;
      } else if (data.CHG_STS === 782) {
        $scope.energySource = chgsts.energySource;
        $scope.energyTarget = chgsts.energyTarget;
      }

      $scope.charging = chgsts.charging;
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
