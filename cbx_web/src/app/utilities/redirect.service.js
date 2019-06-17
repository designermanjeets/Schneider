"use strict";

angular.module('conext_gateway.utilities').factory('redirectService', [ "$window",
  function ($window) {

    var service = {
      redirectToLogin: redirectToLogin,
      redirectTo: redirectTo
    };

    function redirectToLogin() {
      $window.location.href = "/login.html";
    }

    function redirectTo(url) {
      $window.location.href = url;
    }

    return service;
  }
]);
