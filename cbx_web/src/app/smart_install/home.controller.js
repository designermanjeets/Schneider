"use strict";

angular.module('conext_gateway.smart_install').controller('smartInstallHomeController',
  ["$scope", "$window", "$state",
  function($scope, $window, $state) {

  $scope.nextClicked = function() {
    $window.sessionStorage.setItem("SkipStep1App", "false");
    $state.go('^.plant_setup');
  };

  $scope.skipClicked = function() {
    $window.sessionStorage.setItem("SkipStep1App", "true");
    $window.sessionStorage.setItem("Step2StatusApp", "skipped");
    $window.sessionStorage.setItem("Step3StatusApp", "skipped");
    $window.sessionStorage.setItem("Step4StatusApp", "skipped");
    $window.sessionStorage.setItem("Step5StatusApp", "skipped");

    $state.go('dashboard');
  };

}]);
