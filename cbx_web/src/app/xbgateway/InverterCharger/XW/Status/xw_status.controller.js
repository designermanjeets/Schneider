
"use strict";

angular.module('conext_gateway.xbgateway').controller("xwstatusController", [
  "$scope", "$stateParams", "$filter", "$location", "xbdevdetailService", "invChgStsService", "$interval", "$log",
  function($scope, $stateParams, $filter, $location, xbdevdetailService, invChgStsService, $interval, $log) {
    $scope.loadComplete = false;
    $scope.device = $stateParams.device;
    $scope.id = $stateParams.id;

    var requestPending = false;

    getCfgMode();
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

    function getCfgMode() {
      xbdevdetailService.getCfgMode($scope.device, $scope.id).then(function(data) {
        if (data.XW_INV_CFG_MODE === 20 || data.XW_INV_CFG_MODE === 21 || data.XW_INV_CFG_MODE === 22) {
          $scope.splitPhase = true;
        } else {
          $scope.splitPhase = false;
        }
      });
    }
    /* get the device status information */
    function getDevStatus(device, id, queryID) {

      xbdevdetailService.getDevSts(device, id, queryID).then(function(data) {

          data.LOAD_I = data.LOAD_I / 1000;
          data.LOAD_I_LN1 = data.LOAD_I_LN1 / 1000;
          data.LOAD_I_LN2 = data.LOAD_I_LN2 / 1000;
          data.AC1_IN_V_LN1 = data.AC1_IN_V_LN1 / 1000;
          data.AC1_IN_V_LN2 = data.AC1_IN_V_LN2 / 1000;
          data.AC2_V_LN1 = data.AC2_V_LN1 / 1000;
          data.AC2_V_LN2 = data.AC2_V_LN2 / 1000;
          data.DC_V = data.DC_V / 1000;
          /* take absolute values of battery current and power */
          data.AC1_OUT_P_ABS = Math.abs(data.AC1_OUT_P);
          data.DC_I_ABS = Math.abs(data.DC_I / 1000);
          data.DC_P_ABS = Math.abs(data.DC_P);

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
      var invsts;
      var chgsts;

      invsts = invChgStsService.GetInvSts(data);
      chgsts = invChgStsService.GetChgSts(data);

      $scope.invsts = invsts.description;
      $scope.chgsts = chgsts.description;
      $scope.inverting = invsts.inverting;
      $scope.charging = chgsts.charging;
      $scope.powerflow = invsts.inverting || chgsts.charging;

      if (chgsts.charging === true) {
        $scope.energySource = chgsts.energySource;
        $scope.energyTarget = chgsts.energyTarget;
      } else if (invsts.inverting === true) {
        $scope.energySource = invsts.energySource;
        $scope.energyTarget = invsts.energyTarget;
      } else if (data.CHG_STS === 782) {
        $scope.energySource = chgsts.energySource;
        $scope.energyTarget = invsts.energyTarget;
        $scope.powerflow = true;
      }
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
