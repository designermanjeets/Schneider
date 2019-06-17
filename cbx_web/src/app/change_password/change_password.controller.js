/**
 *
 * @copyright (c) 2015 Schneider Electric. All Rights Reserved.
 *   All trademarks are owned by  Schneider Electric Industries SAS or its affiliated companies.
 *
 * @fileOverview
 *
 * @description  Change password html page processing.
 *
 * @version 0.1 Dec 14, 2015   Eddie Leung
 *   created
 *
*/

"use strict";

angular.module('conext_gateway.change_password').controller("changePasswordController",
  ["$scope", "$sessionStorage", "$window", "csbQuery", "changePasswordService", "$log", "$q", "$state", "redirectService",
  function($scope, $sessionStorage, $window, csbQuery, changePasswordService, $log, $q, $state, redirectService) {

  /* Redirect to login page if user session is not active */
  if ($sessionStorage.userName) {
    $scope.userName = $sessionStorage.userName;
  } else {
    redirectService.redirectToLogin();
  }
  $scope.password = {};
  $scope.forms = {};
  $scope.passwordValidationErrors = changePasswordService.initValidationErrors();
  clear();

  /* Assign the clear button event */
  $scope.clearButtonClicked = clear;

  /* Assign the Apply button event */
  $scope.applyButtonClicked = function () {
    changePasswordService.validatePassword($scope.userName, $scope.password, $scope.forms.changePassword);
    changePasswordService.copyValidationErrors($scope.forms.changePassword, $scope.passwordValidationErrors);

    if ($scope.forms.changePassword.$valid) {
      changePasswordService
        .changePassword($scope.userName, $scope.password.oldPassword, $scope.password.newPassword)
        .then(function() {
          return goToNextState();
        })
        .catch(function(failure) {
          clear();
        })
    }
  };

  /**
   *
   * Clear all password fields.
   *
   */
  function clear() {
    $scope.password.oldPassword = "";
    $scope.password.newPassword = "";
    $scope.password.confirmPassword = "";

    // Have to test, because clear can get called before
    // scope.forms is initialized.
    if ($scope.forms.hasOwnProperty('changePassword')) {
      $scope.forms.changePassword.$setPristine();
      $scope.forms.changePassword.$rollbackViewValue();
    }
  }

  function goToNextState() {
    if ($scope.userName === 'Admin') {
      return csbQuery.getObj("SMARTINSTALL/STATUS")
        .then(function(data) {
          if (data.SMARTINSTALL_STATUS) {
            $state.go('dashboard');
          } else {
            $state.go('smart_install');
          }
        })
        .catch(function(failure) {
          $log.error(failure);
        });
    } else {
      $state.go('dashboard');
    }
  }
}]);
