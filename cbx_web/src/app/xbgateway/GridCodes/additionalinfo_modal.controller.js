"use strict";

//Controller used to display the config setting shortname and also the
//information about the config setting
angular.module('conext_gateway.xbgateway').controller("AdditionalInfoModalController", [
  "$scope", "$uibModalInstance", "$log",
  function($scope, $uibModalInstance, $log) {

    $uibModalInstance.opened.then(function() {
      },
      function(error) {
        $log.error("failed to open information_modal model");
      });


    $scope.close = function() {
      $uibModalInstance.close($scope.addInfo);
    };

  }
]);
