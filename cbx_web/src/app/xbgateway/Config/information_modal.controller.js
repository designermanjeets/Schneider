"use strict";

//Controller used to display the config setting shortname and also the
//information about the config setting
angular.module('conext_gateway.xbgateway').controller("InformationModalController", [
  "$scope", "$uibModalInstance", "$log", "shortname", "information",
  function($scope, $uibModalInstance, $log, shortname, information) {

    $uibModalInstance.opened.then(function() {
        $scope.shortname = shortname;
        $scope.information = information;
      },
      function(error) {
        $log.error("failed to open information_modal model");
      });


    $scope.close = function() {
      $uibModalInstance.close();
    };

  }
]);
