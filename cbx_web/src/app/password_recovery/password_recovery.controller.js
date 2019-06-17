"use strict";

angular.module('conext_gateway.change_password').controller("passwordRecoveryController",
  ["$scope", "$log", "$q", "$state", "$stateParams", "passwordRecoveryService", 'redirectService',
  function ($scope, $log, $q, $state, $stateParams, passwordRecoveryService, redirectService) {

    var valid = {
      user: false,
      hash: false,
    };

    $scope.userName = $stateParams.user;
    $scope.password = {};
    $scope.forms = {};
    $scope.state = {
      value: "",
      message: ""
    };
    $scope.passwordValidationErrors = passwordRecoveryService.initValidationErrors();

    isValidUser($scope.userName);
    if (valid.user) {
      isValidHash($stateParams.hash, $scope.userName).then(function () {
        $scope.state.value = valid.hash ? "valid" : "invalid";
      });
    } else {
      $scope.state.value = "invalid";
    }

    $scope.sendEmail = function () {
      passwordRecoveryService.sendEmailLink($stateParams.user);
      $scope.state.value = 'email_sent';
      $scope.state.message = 'passwords.email_sent';
    }

    $scope.redirectToLogin = function() {
      redirectService.redirectToLogin();
    };

    /* Assign the Apply button event */
    $scope.applyButtonClicked = function () {
      passwordRecoveryService.validatePassword($scope.userName, $scope.password, $scope.forms.changePassword);
      passwordRecoveryService.copyValidationErrors($scope.forms.changePassword, $scope.passwordValidationErrors);

      if ($scope.forms.changePassword.$valid) {
        passwordRecoveryService.changePassword($stateParams.hash, $scope.password.newPassword, $scope.userName).then(function (data) {
          if (data.data.description === "Successful") {
            $scope.state.value = "password_changed";
            $scope.state.message = 'passwords.password_changed';
          } else {
            $scope.state.value = "invalid";
            $scope.state.message = 'passwords.invalid_link';
          }
        },
        function (error) {
          $scope.state.value = "invalid";
          $scope.state.message = 'passwords.invalid_link';
        });
      }
    };

    function isValidUser(user) {

      if (user === 'Admin' || user === 'Guest' || user === 'User') {
        valid.user = true;
        $scope.state.message = 'passwords.valid';
      } else {
        valid.user = false;
        $scope.state.message = 'passwords.invalid_user';
      }
    }

    function isValidHash(hash, user) {
      return passwordRecoveryService.validateHash(hash, user).then(function (data) {

        if (data.data.description === undefined) {
          valid.hash = false;
          $scope.state.message = 'passwords.invalid_link';
        }
        else if (data.data.description === 'valid') {
          valid.hash = true;
          $scope.state.message = 'passwords.valid';
        }
        else if (data.data.description === "ExpiredHash") {
          valid.hash = false;
          $scope.state.message = 'passwords.expired_link';
        } else {
          valid.hash = false;
          $scope.state.message = 'passwords.invalid_link';
        }
      }, function (error) {
        valid.hash = false;
        $scope.state.message = 'passwords.invalid_link';
      });
    }
  }]);
