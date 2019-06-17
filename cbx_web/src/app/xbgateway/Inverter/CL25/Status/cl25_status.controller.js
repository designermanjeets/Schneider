
"use strict";

angular.module('conext_gateway.xbgateway').controller("cl25statusController", [
  "$scope", "$stateParams", "$filter", "$location", "xbdevdetailService", "invChgStsService", "$interval", "$log",
  function($scope, $stateParams, $filter, $location, xbdevdetailService, invChgStsService, $interval, $log) {
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
    function getDevStatus(device, id) {

      xbdevdetailService.getDevInfo(device, id).then(function(data) {
          data.AC_REAL_P = parseFloat((data.AC_REAL_P * 0.1).toFixed(1));
          data.AC_I_A = parseFloat((data.AC_I_A * 0.1).toFixed(1));
          data.AC_I_B = parseFloat((data.AC_I_B * 0.1).toFixed(1));
          data.AC_I_C = parseFloat((data.AC_I_C * 0.1).toFixed(1));
          data.AC_V_A = parseFloat((data.AC_V_A * 0.1).toFixed(1));
          data.AC_V_B = parseFloat((data.AC_V_B * 0.1).toFixed(1));
          data.AC_V_C = parseFloat((data.AC_V_C * 0.1).toFixed(1));
          data.PV1_P = parseFloat((data.PV1_P * 0.1).toFixed(1));
          data.PV1_V = parseFloat((data.PV1_V * 0.1).toFixed(1));
          data.PV1_I = parseFloat((data.PV1_I * 0.1).toFixed(1));
          data.PV2_P = parseFloat((data.PV2_P * 0.1).toFixed(1));
          data.PV2_V = parseFloat((data.PV2_V * 0.1).toFixed(1));
          data.PV2_I = parseFloat((data.PV2_I * 0.1).toFixed(1));

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

      invsts = invChgStsService.GetInvSts(data);

      $scope.invsts = invsts.description;
      $scope.inverting = invsts.inverting;

      if (invsts.inverting === true) {
        $scope.energySource = invsts.energySource;
        $scope.energyTarget = invsts.energyTarget;
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
