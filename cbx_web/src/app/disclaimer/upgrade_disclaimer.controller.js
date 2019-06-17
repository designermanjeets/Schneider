"use strict";

angular
    .module("conext_gateway.disclaimer")
    .controller("disclaimerUpgradeController", ["$scope", "$uibModalInstance", "csbQuery", "$log",
      function ($scope, $uibModalInstance, csbQuery, $log) {

      $scope.remoteUpgradeChecked = {
        value: false
      }
      $scope.disclaimerAcceptClicked = function () {
        var requestObject = {};

        var remoteUpgradeSysvarVal = $scope.remoteUpgradeChecked.value === true ? 1 : 0;
        requestObject["ADMIN/DISCLCHECK"] = remoteUpgradeSysvarVal;
        requestObject["/SCB/CNM/ENABLED"] = remoteUpgradeSysvarVal;

        csbQuery.setFromObject(requestObject, true).then(function (success) {
          $uibModalInstance.close(remoteUpgradeSysvarVal);
        }, function (error) {
          $log.error(error);
        });

      };

      $scope.cancel = function () {
        $uibModalInstance.close(0);
      }
    }]);
