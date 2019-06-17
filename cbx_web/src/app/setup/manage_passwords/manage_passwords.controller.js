"use strict";

angular.module('conext_gateway.setup').controller("managePasswordsController",
  ["$scope", "changePasswordService", "$sessionStorage",
  function ($scope, changePasswordService, $sessionStorage) {
    var username = $sessionStorage.userName;
    $scope.password_info = {
      userName: "",
      //TODO Add other uses back after April 15 release
      //users: ["Admin", "User", "Guest"],
      users: getUsersByUser(username),
      password: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    }
    $scope.forms = {};
    $scope.passwordValidationErrors = changePasswordService.initValidationErrors();

    $scope.apply = function() {
      changePasswordService.validatePassword($scope.password_info.userName, $scope.password_info.password, $scope.forms.changePassword);
      changePasswordService.copyValidationErrors($scope.forms.changePassword, $scope.passwordValidationErrors);

      if ($scope.forms.changePassword.$valid) {
        changePasswordService
          .changePassword($scope.password_info.userName, $scope.password_info.password.oldPassword, $scope.password_info.password.newPassword)
          .then(function() {
            $scope.cancel();
          })
          .catch(function() {
            $scope.cancel();
          });
      }
    }

    $scope.cancel = function() {
      $scope.password_info.password.oldPassword = "";
      $scope.password_info.password.newPassword = "";
      $scope.password_info.password.confirmPassword = "";
      $scope.password_info.userName = "";

      $scope.forms.changePassword.$setPristine();
      $scope.forms.changePassword.$rollbackViewValue();
    }

    $scope.resetPassword = function() {

    }

    function getUsersByUser(input) {
      var users = [];
      if (input === 'Admin') {
        users.push('Admin');
      }
      if (input === 'Admin' || input === 'User') {
        users.push('User');
        users.push('Guest');
      }
      return users;
    }
  }
]);
