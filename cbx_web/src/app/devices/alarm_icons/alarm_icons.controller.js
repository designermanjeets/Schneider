"use strict";

angular.module('conext_gateway.devices').controller("AlarmIconsController", [
  "$scope",
  function ($scope) {
    // Convert from string to boolean
    //$scope.deviceIsPresent = $scope.deviceIsPresent === "true";
    //$scope.hasAlarms = $scope.hasAlarms == "true";
    //$scope.hasWarnings = $scope.hasWarnings == "true";


    //if ($scope.deviceIsPresent === false) {
    //  $scope.ok = {
    //    active: false,
    //    message: "Device missing"
    //  };
    //  $scope.alarms = {
    //    active: false,
    //    message: "Device missing",
    //  };
    //  $scope.warnings = {
    //    active: false,
    //    message: "Device missing",
    //  }
    //}
    //else {
    //  $scope.ok = {};
    //  $scope.alarms = {};
    //  $scope.warnings = {};

    //  $scope.ok.active = !$scope.hasAlarms && !$scope.hasWarnings;
    //  $scope.alarms.active = $scope.hasAlarms;
    //  $scope.warnings.active = $scope.hasWarnings;

    //  $scope.ok.message = ($scope.ok.active) ?
    //    "No alarms or warnings" : "Device has alarms and/or warnings";
    //  $scope.alarms.message = ($scope.alarms.active) ?
    //    "Device has active alarms" : "No alarms";
    //  $scope.warnings.message = ($scope.warnings.active) ?
    //    "Device has active warnings" : "No warnings";
    //}

  }]);
