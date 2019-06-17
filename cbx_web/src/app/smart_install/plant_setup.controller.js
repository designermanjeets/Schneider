"use strict";

angular.module('conext_gateway.smart_install').controller('smartInstallPlantSetupController',
  ["$scope", "$timeout", "$translate", "smartInstallService", "dateTimeService",
  "$log", "$state", "MAX_AC_CAPACITY_KW", "MAX_SNTP_SERVER_NAME_LEN", "sntpTestService",
  function ($scope, $timeout, $translate, smartInstallService, dateTimeService,
    $log, $state, MAX_AC_CAPACITY_KW, MAX_SNTP_SERVER_NAME_LEN, sntpTestService) {

    $scope.forms = {};
    $scope.plant_setup = {};
    $scope.currentYear = new Date().getFullYear();
    $scope.calendar = {isOpen: false};
    $scope.openCalendar = function (e) {
      $scope.calendar.isOpen = true;
    };
    $scope.MAX_AC_CAPACITY_KW = MAX_AC_CAPACITY_KW;
    $scope.MAX_SNTP_SERVER_NAME_LEN = MAX_SNTP_SERVER_NAME_LEN;
    $scope.timezoneList = null;

    dateTimeService.getTimeConfig().then(function (data) {
      angular.extend($scope.plant_setup, data.plant_setup);
      var ac_capacity = parseFloat(data.plant_setup.acCapacity);
      $scope.plant_setup.acCapacity = (isNaN(ac_capacity)) ? 0 : ac_capacity;
      $scope.timezoneList = data.timezoneList;

      $scope.inputEnable = true;
    });

    var translationKeys = [
      'performance.date-picker.buttons.today',
      'performance.date-picker.buttons.now',
      'performance.date-picker.buttons.date',
      'performance.date-picker.buttons.time',
      'performance.date-picker.buttons.done',
    ];
    $translate(translationKeys).then(function(stringForKey) {
      $scope.text = {
        today : stringForKey['performance.date-picker.buttons.today'],
        now   : stringForKey['performance.date-picker.buttons.now'],
        date  : stringForKey['performance.date-picker.buttons.date'],
        time  : stringForKey['performance.date-picker.buttons.time'],
        close : stringForKey['performance.date-picker.buttons.done'],
      }
    }).catch(function(error) {
      $log.error("Could not load translations");
      $log.error(error);
    });


    $scope.nextClicked = function() {
      $scope.successMessage = false;
      $scope.errorMessage = false;
      if ($scope.forms.quickSetup.$valid) {
        $scope.processingMessage = true;
        $scope.inputEnable = false;

        dateTimeService
          .setTimeConfig($scope.plant_setup)
          .then(function () {
            sntpTestService.testSNTP($scope, function(status) {
              $scope.processingMessage = false;
              if (status === 'Success') {
                $scope.successMessage = true;
                $scope.$emit('layout.updateClock');
                $timeout(function() {
                  // TODO: This should be changed to use $window.sessionStorage
                  /* global sessionStorage */
                  sessionStorage.setItem("Step2StatusApp", "success");
                  $state.go('^.detect_devices');
                }, 3000);
              } else {
                $scope.processingMessage = false;
                $scope.errorMessage = true;
                $timeout(function () {
                  $scope.plantSetupMessage = "";
                }, 10000);
              }
            });
          }).catch(function (error) {
            $scope.processingMessage = false;
            $scope.errorMessage = true;
            $log.error(error);
            $timeout(function () {
              $scope.plantSetupMessage = "";
            }, 10000);
          })
      }
    }

  }]);
