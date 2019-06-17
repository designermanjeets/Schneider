
"use strict";

angular.module('conext_gateway.xbgateway').controller("gtstatusController", [
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
    function getDevStatus(device, id, queryID) {

      xbdevdetailService.getDevSts(device, id, queryID).then(function(data) {
          data.DC_V = data.DC_V / 1000;
          data.DC_I = data.DC_I / 1000;
          data.AC1_V = data.AC1_V / 1000;
          data.AC1_I = data.AC1_I / 1000;
          data.AC1_F = data.AC1_F / 100;
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
