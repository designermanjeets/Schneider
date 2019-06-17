"use strict";

angular.module('conext_gateway.xbgateway').controller("scpstatusController", [
   "$scope", "$stateParams", "$filter", "$location", "xbdevdetailService", "$interval", "$log",
  function ( $scope, $stateParams, $filter, $location, xbdevdetailService, $interval, $log ) {
    $scope.loadComplete = false;
    $scope.device = $stateParams.device;
    $scope.id = $stateParams.id;

    var requestPending = false;

    /* request initial status */
    getDevStatus($scope.device, $scope.id);

    /* set up a periodic query */
    var interval = $interval(function () {
      if (!requestPending) {
        var queryID = $scope.device + $scope.id + 'sts';
        requestPending = true;
        getDevStatus($scope.device, $scope.id, queryID);
      }
    }, 1000);

    /* get the device status information */
    function getDevStatus(device, id, queryID) {

      xbdevdetailService.getDevSts(device, id, queryID).then(function(data) {
          $scope.data = data

          $scope.loadComplete = true;
          requestPending = false;
      },
      function (error) {
          $log.error( error);
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
