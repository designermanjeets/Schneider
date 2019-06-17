"use strict";

angular.module('conext_gateway.devices').controller("DetectionModalController", [
  "$scope", "detectionService", "$interval", "$uibModalInstance",
  "detectionRanges", "$log",
  function ($scope, detectionService, $interval, $uibModalInstance,
    detectionRanges, $log) {

    var requestPending = false;
    var detectionProgressInterval;
    $scope.detectionProgressStatus = 0;
    $scope.detectionResults = {};

    // Detection states:
    // 1. 'running'
    // 2. 'finished' or 'aborted'
    $scope.detectionState = 'running';

    $uibModalInstance.opened.then(function () {
      $scope.detectionProgressStatus = 0;
      detectionService.startDeviceDetection(detectionRanges).then(function () {

        detectionProgressInterval = $interval(function () {
          if (!requestPending) {
            requestPending = true;
            detectionService.getDetectionProgress(detectionRanges).then(function(data) {
                $scope.detectionProgressStatus = data;
                if (parseInt($scope.detectionProgressStatus) === 100) {
                  stopDetectionProgress('finished');
                }
                requestPending = false;
              },
              function(error) {
                $log.error("Failed to get detection progress");
                requestPending = false;
              });
          }
        }, 1000);

      });
    },
    function (error) {
      requestPending = false;
      $log.error("failed to open detection model");
    });

    $scope.stopDeviceDetection = function () {
      detectionService.stopDeviceDetection(detectionRanges);
      requestPending = false;
      stopDetectionProgress('aborted');
    };

    function stopDetectionProgress(state) {
      if (detectionProgressInterval) {
        $interval.cancel(detectionProgressInterval);
        detectionService.getTotalDeviceCount(detectionRanges).then(function (data) {
          $scope.detectionResults = data;
          $scope.detectionState = state;
          $scope.detectionProgressStatus = 100;
          },
        function(error) {
          $log.error("Failed to get device count");
          $scope.detectionState = 'aborted';
        });
      }
    }

    $scope.getTotalCount = function() {
      var totalCount = 0;
      if($scope.detectionResults.bus1Count) {
        totalCount += $scope.detectionResults.bus1Count.totalCount;
      }

      if($scope.detectionResults.bus2Count) {
        totalCount += $scope.detectionResults.bus2Count.totalCount;
      }
      return totalCount;
    };

    $scope.close = function () {
      $uibModalInstance.close($scope.detectionResults);
    };

    var dereg = $scope.$on("$destroy", function () {
      if (detectionProgressInterval) {
        $interval.cancel(detectionProgressInterval);
        requestPending = false;
        dereg();
      }
    });
  }]);
