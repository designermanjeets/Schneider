"use strict";

angular.module('conext_gateway.layout').controller("headerController",
  ["$rootScope", "$scope", "$window", "$sessionStorage", "$uibModal", "csbQuery", "$log",
   "$q", "$interval", "moment", "TIME_LOCAL_FORMAT", "queryService", "temperatureService", "redirectService",
  function ($rootScope, $scope, $window, $sessionStorage, $uibModal, csbQuery, $log,
    $q, $interval, moment, TIME_LOCAL_FORMAT, queryService, temperatureService, redirectService) {
    var userName = "";
    var requestPending = false;
    userName = $sessionStorage.userName;

    /* Turn on/off disclaimer link */
    if ((userName === "Admin") || (userName === "User")) {
      $scope.disclaimer = true;
    } else {
      $scope.disclaimer = false;
    }

    /* Get all the Conext Gateway info */
    getHeaderInformation();
    var interval = $interval(function () {
      if (!requestPending) {
        requestPending = true;
        getHeaderInformation();
      }
    }, 60000);
    $scope.$on("layout.updateClock", getHeaderInformation);

    /* Assign user name */
    $scope.userName = userName;

    /* Disclaimer click function */
    $scope.openDisclaimer = function () {
      /* Open Modal */
      $uibModal.open({
        animation: true,
        backdrop: "static",
        keyboard: false,
        templateUrl: "app/disclaimer/disclaimer.html",
        controller: "disclaimerModalController",
        scope: $scope,
        size: "lg",
        resolve: {
          userName: function () {
            $log.debug("resolve, user name: " + userName);
            return userName;
          }
        }
      });
    }

    /* Logout click processing */
    $scope.logout = function () {
      delete $sessionStorage.userName;
      csbQuery.logout().then(function (success) {
        redirectService.redirectToLogin();
      }, function (error) {
        $log.error("Logout error");
        redirectService.redirectToLogin();
      });
    }

    function getHeaderInformation() {
      queryService.getSysvars(['TIME/LOCAL_ISO_STR','TIMEZONE','SW_VER','SW_BUILD_NUMBER','FRIENDLYNAME', 'HMI/TEMPERATURE/UNIT'])
      .then(function (data) {
        // Remove seconds from the clock
        $scope.dateTime = moment.tz(data.TIME_LOCAL_ISO_STR, TIME_LOCAL_FORMAT, data.TIMEZONE)
          .format("YYYY/MM/DD HH:mm");
        $rootScope.TIMEZONE = data.TIMEZONE;
        $scope.softwareVerion = data.SW_VER;
        $scope.buildNumber = data.SW_BUILD_NUMBER;
        $scope.deviceName = data.FRIENDLYNAME;
        temperatureService.setTemperatureType(data.HMI_TEMPERATURE_UNIT);
        $scope.startup = 'done';
        requestPending = false;
      }, function (error) {
        $q.reject(error);
        requestPending = false;
      });
    }

    var dereg = $scope.$on("$destroy", function () {
      if (interval) {
        $interval.cancel(interval);
        requestPending = false;
        dereg();
      }
    });
  }
]);
