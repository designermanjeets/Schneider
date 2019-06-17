"use strict";

angular.module('conext_gateway.smart_install').controller('deviceConfigController', ["$scope", "deviceConfigService", "$state", "$window",
  function($scope, deviceConfigService, $state, $window) {

    deviceConfigService.getCurrentDevice().then(function(data) {
      $scope.device = data;
    });

    $scope.nextClicked = function() {
      $scope.device = deviceConfigService.getNextDevice();
    };

    $scope.skipClicked = function() {
      $window.sessionStorage.setItem("SkipStep1App", "true");
      $window.sessionStorage.setItem("Step2StatusApp", "skipped");
      $window.sessionStorage.setItem("Step3StatusApp", "skipped");
      $window.sessionStorage.setItem("Step4StatusApp", "skipped");
      $window.sessionStorage.setItem("Step5StatusApp", "skipped");

      $state.go('dashboard');
    };

  }
]);
