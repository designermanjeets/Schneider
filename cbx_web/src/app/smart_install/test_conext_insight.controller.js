/* eslint angular/angularelement:0  */
// the old code uses == with numbers, and may be using the
// feature that allows "1" == 1. Allow that use of ==
// since we don't have time to investigate.
/* eslint-disable eqeqeq */

"use strict";

angular.module('conext_gateway.smart_install').controller('smartInstallTestConnectInsightController',
  ["$scope", "csbQuery", "csbModal", "$window", "$interval", "$state", "conextInsightService", "$uibModal",
  function ($scope, csbQuery, csbModal, $window, $interval, $state, conextInsightService, $uibModal) {
    $scope.connectionStatus = null;
    $scope.settings = {
      disclaimer: true
    };
    csbQuery.getObj("ADMIN/DISCLCHECK").then(function (data) {
      var PortalDiscStatus = data.ADMIN_DISCLCHECK;
      if (PortalDiscStatus === 1) {
        if ($window.sessionStorage.getItem("connextPortalTest") !== "true") { // Or
          // web
          // portal
          // already
          // enabled
          $("#btnConInsightNext").attr("disabled", "disabled");
        }
      } else {
        //$("#btnConInsightTest").attr("disabled", "disabled");
        $scope.settings.disclaimer = false;
        $("#btnConInsightNext").attr("disabled", "disabled");
        $scope.showDisclaimerWarning = true;
      }
    });

    $scope.skipClicked = function () {
      $window.sessionStorage.setItem("Step4StatusApp", "skipped");
      $state.go('^.change_password');
    };

    $scope.openDisclaimer = function () {
      /* Open Modal */
      $uibModal.open({
        animation: true,
        backdrop: "static",
        keyboard: false,
        templateUrl: "app/disclaimer/monitoring_disclaimer.html",
        controller: "disclaimerMonitoringController",
        scope: $scope,
        size: "lg"
      }).result.then(function (data) {
        $scope.settings.disclaimer = (data === 0) ? false : true;
      });
    }

    $scope.nextClicked = function () {
      $state.go('^.change_password');
    };

    $scope.connectToInsightClicked = function () {
      $scope.connectionStatus = 'Processing';
      conextInsightService.testConnection(function (data) {
        $window.sessionStorage.setItem("Step4StatusApp", (data === 'Fail') ? "Failed" : "success");
        $("#btnConInsightNext").removeAttr("disabled");
        $scope.connectionStatus = data;
      }, $scope);
    };

  }]);
