
"use strict";

angular.module('conext_gateway.layout').controller("masterLayoutController", ["$scope", "$log", "deviceService", 'helpDocService', 'queryService', '$state',
  function($scope, $log, deviceService, helpDocService, queryService, $state) {
    $scope.helpIsOpen = false;
    $scope.configurationRequired = false;
    $scope.testState = 0;
    $scope.$state = $state;
    $scope.loadHelp = function() {
      helpDocService.loadDoc();
    };

    getTestState();
    function getTestState() {
    queryService.getSysvars(['/SCB/SEEED/EMITEST'], {}).then(function(data) {
      $scope.testState = data.SCB_SEEED_EMITEST;
    });
  }

    $scope.toggleEmiTest = function() {
      var sysvar = {};
      sysvar['/SCB/SEEED/EMITEST'] = ( $scope.testState === 1 ) ? 0 : 1;
      return queryService.setSysvars([sysvar]).then(function() {
        getTestState();
      });
    }
  }
]);
