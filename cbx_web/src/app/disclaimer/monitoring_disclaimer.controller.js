"use strict";

angular
    .module("conext_gateway.disclaimer")
    .controller("disclaimerMonitoringController", ["$scope", "$uibModalInstance", "csbQuery", "$log",
      function ($scope, $uibModalInstance, csbQuery, $log) {

      $scope.remoteMonitorChecked = {
        value: false
      }
      $scope.disclaimerAcceptClicked = function () {
        var requestObject = {};

        var remoteMonitorSysvarVal = $scope.remoteMonitorChecked.value === true ? 1 : 0;
        requestObject["ADMIN/DISCLCHECK"] = remoteMonitorSysvarVal;
        requestObject["WEBPORTAL/ENABLE"] = remoteMonitorSysvarVal;
        requestObject['/SCB/IOT/ENABLE'] = remoteMonitorSysvarVal;
        csbQuery.setFromObject(requestObject, true).then(function (success) {
          $uibModalInstance.close(remoteMonitorSysvarVal);
        }, function (error) {
          $log.error(error);
        });

      };

      $scope.cancel = function () {
        $uibModalInstance.close(0);
      }
    }]);
