"use strict";

angular.module('conext_gateway.xbgateway').controller("agsstatusController", [
   "$scope", "$stateParams", "$filter", "$location", "xbdevdetailService", "invChgStsService", "$interval", "$log",
  function ( $scope, $stateParams, $filter, $location, xbdevdetailService, invChgStsService, $interval, $log ) {
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

          $scope.ags_status = invChgStsService.AGSState( data.GEN_STATE );
          $scope.gen_status = invChgStsService.GenState( data.GEN_ACTION );
          $scope.gen_on_reason = invChgStsService.GenOnReason( data.GEN_ON_REASON );
          $scope.gen_off_reason = invChgStsService.GenOffReason( data.GEN_OFF_REASON );

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
