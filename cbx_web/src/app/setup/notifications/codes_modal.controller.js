"use strict";

angular.module('conext_gateway.setup').controller("codesModalController", [
  "$scope", "notificationsService", "$uibModalInstance", "codes",
  function ($scope, notificationsService, $uibModalInstance, codes) {

    codes.allCodes.then(function (data) {
      angular.forEach(data.data, function(value, key) {
        if (codes.selectedCodes.indexOf(String(value.code)) > -1) {
          value.selected = true;
        }
      });
      $scope.event = {
        codes: data.data
      }
    });

    $scope.apply = function() {
      var codeList = [];
      angular.forEach($scope.event.codes, function (value, key) {
        if (value.selected) {
          codeList.push(value.code);
        }
      });
      $uibModalInstance.close(codeList.toString());
    }

    $scope.cancel = function() {
      $uibModalInstance.close(null);
    }
  }
]);
