"use strict";

angular.module('conext_gateway.password_recovery')
  .factory('passwordRecoveryService',
  ['$q', 'loginService', '$http', 'csbQuery',
  function ($q, loginService, $http, csbQuery) {
    return {
      validateHash: validateHash,
      changePassword: changePassword,
      validatePassword: validatePassword,
      copyValidationErrors: copyValidationErrors,
      initValidationErrors: initValidationErrors,
      sendEmailLink: sendEmailLink
    };

    function initValidationErrors() {
      return {
        userName: { 'error': {}, invalid: false },
        newPassword: { 'error': {}, invalid: false },
        confirmPassword: { 'error': {}, invalid: false },
      }
    }

    function changePassword(hash, password, username) {
      return $http.post("/resetpassword", "hash=" + hash + "&password=" + password + "&username=" + username);
    }

    function validateHash(hash, userName) {
      return $http.post("/validatehash", "username=" + userName + "&hash=" + hash);
    }

    function validatePassword(userName, passwords, form) {
      var passwordsMatch = passwords.newPassword === passwords.confirmPassword;
      form.newPassword.$setValidity('passwordsMatch', passwordsMatch);
      form.confirmPassword.$setValidity('passwordsMatch', passwordsMatch);

      var validPassword = loginService.checkPassword(passwords.newPassword);
      form.newPassword.$setValidity('validPassword', validPassword);

      //var defaultAdminPassword = (userName === "Admin") ? (passwords.newPassword !== "Admin123") : true;
      //var defaultUserPassword = (userName === "User") ? (passwords.newPassword !== "User123") : true;
      //var defaultGuestPassword = (userName === "Guest") ? (passwords.newPassword !== "Guest123") : true;
      //form.newPassword.$setValidity('defaultPassword', defaultAdminPassword && defaultUserPassword && defaultGuestPassword);
    }

    function copyValidationErrors(form, errorObject) {
      // change_password.html doesn't have a userName field in the form;
      // mange_passwords.html does.
      var userNameErrors = form.hasOwnProperty('userName') ?
        form.userName.$error : {};
      var newPasswordErrors = form.newPassword.$error;
      var confirmPasswordErrors = form.confirmPassword.$error;

      var hasUserNameErrors = Object.keys(userNameErrors).length > 0;
      var hasNewPasswordErrors = Object.keys(newPasswordErrors).length > 0;
      var hasConfirmPasswordErrors = Object.keys(confirmPasswordErrors).length > 0;

      // .invalid is used to highlight the input fields. Always show as many of them as are
      // applicable.
      errorObject.userName.invalid = hasUserNameErrors;
      errorObject.newPassword.invalid = hasNewPasswordErrors;
      errorObject.confirmPassword.invalid = hasConfirmPasswordErrors;

      // .error is used to show the error messages. Only show one kind of message
      // at a time. So if username has an error, don't also show errors for
      // oldPassword. And so on.
      if (hasUserNameErrors) {
        newPasswordErrors = {};
      }

      angular.copy(userNameErrors, errorObject.userName.error);
      angular.copy(newPasswordErrors, errorObject.newPassword.error);
    }

    function sendEmailLink(userName) {
      return csbQuery.sendPasswordRecoveryMail(userName);
    }

  }]);
