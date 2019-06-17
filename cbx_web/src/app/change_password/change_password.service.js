"use strict";

angular.module('conext_gateway.change_password')
  .factory('changePasswordService',
  ['loginService', 'csbQuery', 'csbModal', '$log', '$q',
  function(loginService, csbQuery, csbModal, $log, $q) {
    return {
      validatePassword: validatePassword,
      changePassword: changePassword,

      initValidationErrors: initValidationErrors,
      copyValidationErrors: copyValidationErrors,
    };

    function validatePassword(userName, passwords, form) {
      var passwordsMatch = passwords.newPassword === passwords.confirmPassword;
      form.newPassword.$setValidity('passwordsMatch',     passwordsMatch);
      form.confirmPassword.$setValidity('passwordsMatch', passwordsMatch);

      var validPassword = loginService.checkPassword(passwords.newPassword);
      form.newPassword.$setValidity('validPassword', validPassword);

      //var defaultAdminPassword = (userName === "Admin") ? (passwords.newPassword !== "Admin123") : true;
      //var defaultUserPassword  = (userName === "User")  ? (passwords.newPassword !== "User123")  : true;
      //var defaultGuestPassword = (userName === "Guest") ? (passwords.newPassword !== "Guest123") : true;
      //form.newPassword.$setValidity('defaultPassword', defaultAdminPassword && defaultUserPassword && defaultGuestPassword);

      var sameAsOldPassword = passwords.newPassword !== passwords.oldPassword;
      form.newPassword.$setValidity('sameAsOldPassword', sameAsOldPassword);
    }

    function changePassword(userName, oldPassword, newPassword) {
      /* Go and change the password */
      return csbQuery
        .changePassword(userName, oldPassword, newPassword)
        .then(function(status) {
          return csbModal.alert("changePasswordSuccess");
        })
        .catch(function(failure) {
          $log.error(failure);
          csbModal.alert("changePasswordFail");

          return $q.reject(failure);
        });
    }

    function initValidationErrors() {
      return {
        userName:    {'error': {}, invalid: false},
        oldPassword: {'error': {}, invalid: false},
        newPassword: {'error': {}, invalid: false},
        confirmPassword: {'error': {}, invalid: false},
      }
    }

    // This fixes CSBQNX-290 and avoids flashing error messages on submit.
    //
    // PROBLEM: After submitting the password form, we clear the password data from the
    // text boxes. And even though we also call $setPristine() to clear the $submitted flag,
    // there is a brief window of time when the error boxes appear. This is because of the
    // order in which the DOM elements are updated: First, $error is updated on the form elements,
    // showing the error messages. Then, $submitted is updated on the form itself, hiding the error
    // messages.
    //
    // SOLUTION: Control when we update the form validation. By having the error messages in
    // password_errors.html watch on the passwordValidationErrors object, we can control when that
    // object is updated. By only updating that object on submit, we avoid having errors flash
    // at other, inappropriate times.
    function copyValidationErrors(form, errorObject) {
      // change_password.html doesn't have a userName field in the form;
      // mange_passwords.html does.
      var userNameErrors = form.hasOwnProperty('userName') ?
        form.userName.$error : {};
      var oldPasswordErrors = form.oldPassword.$error;
      var newPasswordErrors = form.newPassword.$error;
      var confirmPasswordErrors = form.confirmPassword.$error;

      var hasUserNameErrors    = Object.keys(userNameErrors).length > 0;
      var hasOldPasswordErrors = Object.keys(oldPasswordErrors).length > 0;
      var hasNewPasswordErrors = Object.keys(newPasswordErrors).length > 0;
      var hasConfirmPasswordErrors = Object.keys(confirmPasswordErrors).length > 0;

      // .invalid is used to highlight the input fields. Always show as many of them as are
      // applicable.
      errorObject.userName.invalid = hasUserNameErrors;
      errorObject.oldPassword.invalid = hasOldPasswordErrors;
      errorObject.newPassword.invalid = hasNewPasswordErrors;
      errorObject.confirmPassword.invalid = hasConfirmPasswordErrors;

      // .error is used to show the error messages. Only show one kind of message
      // at a time. So if username has an error, don't also show errors for
      // oldPassword. And so on.
      if (hasUserNameErrors) {
        oldPasswordErrors = {};
        newPasswordErrors = {};
      }
      if (hasOldPasswordErrors) {
        newPasswordErrors = {};
      }
      angular.copy(userNameErrors,    errorObject.userName.error);
      angular.copy(oldPasswordErrors, errorObject.oldPassword.error);
      angular.copy(newPasswordErrors, errorObject.newPassword.error);
    }
}]);
