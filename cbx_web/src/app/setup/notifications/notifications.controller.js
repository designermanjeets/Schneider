"use strict";

angular.module('conext_gateway.setup').controller("notificationsController", ["$scope", "notificationsService", "formSuccessMessageService", "$uibModal", "$log",
  function ($scope, notificationsService, formSuccessMessageService, $uibModal, $log) {
    $scope.forms = {};
    $scope.successMessage = {};
    $scope.email_addresses = {
      address1: "",
      address2: "",
      address3: "",
      address4: "",
      address5: ""
    }

    $scope.notification_setup = {
      inverter_codes: "",
      inverter_occurances: "",
      meter_codes: "",
      meter_occurances: "",
      system_codes: "",
      system_occurances: ""
    }

    $scope.applyEmails = function () {
      if ($scope.forms.email_addresses.$valid) {
        notificationsService.saveEmails($scope.email_settings).then(
          function (response) {
            formSuccessMessageService.show($scope, "email_addresses");
          },
          function (error) {

          });
      }
    }

    $scope.applyNotificationSettings = function () {
      var inverterCodes = convertCodesToArray($scope.forms.notification_setup.inverter_codes.$viewValue);
      var meterCodes = convertCodesToArray($scope.forms.notification_setup.meter_codes.$viewValue);
      var systemCodes = convertCodesToArray($scope.forms.notification_setup.system_codes.$viewValue);
      $scope.forms.notification_setup.system_codes.$setValidity("format", systemCodes != null);
      $scope.forms.notification_setup.meter_codes.$setValidity("format", meterCodes != null);
      $scope.forms.notification_setup.inverter_codes.$setValidity("format", inverterCodes != null);


      if ($scope.forms.notification_setup.$valid) {

        setOccuranceToDefaultIfEmpty();
        notificationsService.saveNotificationSetup($scope.notification_setup).then(
          function (response) {
            formSuccessMessageService.show($scope, "notification_setup");
          },
          function (error) {

          });
      }
    }

    $scope.resetEmails = function () {
      notificationsService.getEmails().then(function (data) {
        $scope.email_addresses = data;
        $scope.forms.email_addresses.$rollbackViewValue();
        $scope.forms.email_addresses.$setPristine();
      },
      function (error) {

      });
    }

    $scope.resetNotificationSetup = function () {
      notificationsService.getNotificationSetup().then(function (data) {
        $scope.notification_setup = data;
        $scope.forms.notification_setup.$rollbackViewValue();
        $scope.forms.notification_setup.$setPristine();
      },
      function (error) {

      });
    }

    $scope.openInverterCodes = function () {
      var codes = convertCodesToArray($scope.forms.notification_setup.inverter_codes.$viewValue);
      $scope.forms.notification_setup.inverter_codes.$setValidity("format", codes != null);
      if (codes) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/setup/notifications/codes_modal.html',
          controller: 'codesModalController',
          resolve: {
            codes: function () {
              return {
                selectedCodes: codes,
                allCodes: notificationsService.getInverterCodes()
              }
            }
          },
          backdrop: 'static',
          keyboard: false
        });

        modalInstance.result.then(
          function (result) {
            if (result) {
              $scope.notification_setup.inverter_codes = result;
            }
          },
          function (error) {
            $log.error(error);
          }
        );
      }
    }

    $scope.openMeterCodes = function () {
      var codes = convertCodesToArray($scope.forms.notification_setup.meter_codes.$viewValue);
      $scope.forms.notification_setup.meter_codes.$setValidity("format", codes != null);
      if (codes) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/setup/notifications/codes_modal.html',
          controller: 'codesModalController',
          resolve: {
            codes: function () {
              return {
                selectedCodes: codes,
                allCodes: notificationsService.getMeterCodes()
              }
            }
          },
          backdrop: 'static',
          keyboard: false
        });

        modalInstance.result.then(
          function (result) {
            $scope.notification_setup.meter_codes = result;
          },
          function (error) {
            $log.error(error);
          }
        );
      }
    }

    $scope.openSystemCodes = function () {
      var codes = convertCodesToArray($scope.forms.notification_setup.system_codes.$viewValue);
      $scope.forms.notification_setup.system_codes.$setValidity("format", codes != null);
      if (codes) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/setup/notifications/codes_modal.html',
          controller: 'codesModalController',
          resolve: {
            codes: function () {
              return {
                selectedCodes: codes,
                allCodes: notificationsService.getSystemCodes()
              }
            }
          },
          backdrop: 'static',
          keyboard: false
        });

        modalInstance.result.then(
          function (result) {
            $scope.notification_setup.system_codes = result;
          },
          function (error) {
            $log.error(error);
          }
        );
      }
    }

    function setOccuranceToDefaultIfEmpty() {
      if ($scope.notification_setup.inverter_codes !== '' && ($scope.notification_setup.inverter_occurances === '' || $scope.notification_setup.inverter_occurances === null)) {
        $scope.notification_setup.inverter_occurances = 1;
      }

      if ($scope.notification_setup.meter_codes !== '' && ($scope.notification_setup.meter_occurances === '' || $scope.notification_setup.meter_occurances === null)) {
        $scope.notification_setup.meter_occurances = 1;
      }

      if ($scope.notification_setup.system_codes !== '' && ($scope.notification_setup.system_occurances === '' || $scope.notification_setup.system_occurances === null)) {
        $scope.notification_setup.system_occurances = 1;
      }
    }

    function convertCodesToArray(codes) {
      if (codes === null || codes === '') {
        return [];
      }
      var listOfCodes = codes.split(",");

      angular.forEach(listOfCodes, function (value, key) {
        if (!(value >>> 0 === parseFloat(value))) {
          listOfCodes = null;
          return listOfCodes;
        }
      });
      return listOfCodes;
    }
  }
]);
