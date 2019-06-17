"use strict";

//Controller used to display the config setting shortname and also the
//information about the config setting
angular.module('conext_gateway.xbgateway').controller("GCConfirmationModalController", [
  "$scope", "$uibModalInstance", "$log", "info",
  function($scope, $uibModalInstance, $log, info) {

    $scope.title = info.title;
    $scope.description = info.description;
    $uibModalInstance.opened.then(function() {},
      function(error) {
        $log.error("failed to open information_modal model");
      });


    $scope.apply = function() {
      $uibModalInstance.close();
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss();
    };

  }
]);
