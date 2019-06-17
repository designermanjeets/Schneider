"use strict";

angular.module('conext_gateway.setup').controller("dataExportController", ["$scope", "dataExportService", "timezoneService", "moment",
  function ($scope, dataExportService, timezoneService, moment) {
    var dateParameters = {};
    $scope.datePicker = {
      yieldFromDateOpen: false,
      yieldToDateOpen: false,
      logFromDateOpen: false,
      logToDateOpen: false,
      yieldError: {},
      logError: {}
    }

    $scope.dates = {
    }

    $scope.openYieldFromDate = function () {
      $scope.datePicker.yieldFromDateOpen = true;
    };

    $scope.openYieldToDate = function () {
      $scope.datePicker.yieldToDateOpen = true;
    };

    $scope.openLogFromDate = function () {
      $scope.datePicker.logFromDateOpen = true;
    };

    $scope.openLogToDate = function () {
      $scope.datePicker.logToDateOpen = true;
    };

    $scope.exportYieldData = function() {
      if (moment($scope.dates.yieldFromDate).isSame($scope.dates.yieldToDate) || moment($scope.dates.yieldFromDate).isBefore($scope.dates.yieldToDate)) {
        $scope.datePicker.yieldError["overlap"] = false;
      } else {
        $scope.datePicker.yieldError["overlap"] = true;
      }
    }

    $scope.exportLogData = function () {
      if (moment($scope.dates.logFromDate).isSame($scope.dates.logToDate) || moment($scope.dates.logFromDate).isBefore($scope.dates.logToDate)) {
        $scope.datePicker.logError["overlap"] = false;
      } else {
        $scope.datePicker.logError["overlap"] = true;
      }
    }

    dataExportService.getTimeData().then(function (result) {
      dateParameters = timezoneService.getDateParameters(result);
      $scope.dates.yieldFromDate = dateParameters.date;
      $scope.dates.yieldToDate = dateParameters.date;
      $scope.dates.logFromDate = dateParameters.date;
      $scope.dates.logToDate = dateParameters.date;
      $scope.dates.minDate = dateParameters.minDate;
      $scope.dates.maxDate = dateParameters.maxDate;
    },
    function (error) {
    });


  }
]);
