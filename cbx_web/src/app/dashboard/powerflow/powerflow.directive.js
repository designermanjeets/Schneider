"use strict";

angular.module('conext_gateway.dashboard').directive('powerFlow', ['$timeout', function($timeout, $rootScope) {


  var link = function($scope, element, attributes) {
    var powerflow = new Powerflow("/");

    powerflow.onChargerClick(function(chargers) {
      $timeout(function() {
        $scope.chargerClick(chargers);
      }, 100);
    });

    powerflow.onInverterClick(function(inverters) {
      $timeout(function() {
        $scope.inverterClick(inverters);
      }, 100);
    });

    powerflow.onGridTieInverterClick(function(gts) {
      $timeout(function() {
        $scope.gridTieClick(gts);
      }, 100);
    });

    powerflow.onInverterChargerClick(function(inverterChargers) {
      $timeout(function() {
        $scope.inverterChargerClick(inverterChargers);
      }, 100);
    });

    powerflow.onBattmonClick(function(battmonId) {
      $timeout(function() {
        $scope.battmonClick(battmonId);
      }, 100);
    });

    powerflow.onGeneratorClick(function(generators) {
      $timeout(function() {
        $scope.generatorClick(generators);
      }, 100);
    });

    $scope.$on('powerFlow', function(event, data) {
      powerflow.update(data);
    });

    var dereg = $scope.$on("$destroy", function() {
      powerflow.stopAnimation();
      dereg();
    });

  };

  return {
    restrict: 'A',
    transclude: true,
    link: link
  };


}]);
