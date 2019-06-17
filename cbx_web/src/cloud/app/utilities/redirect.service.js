"use strict";

angular.module('conext_gateway.utilities').factory('redirectService', ["$state",
  function($state) {

    var service = {
      redirectToLogin: redirectToLogin,
      redirectTo: redirectTo
    };

    function redirectToLogin() {
      $state.go('login');
    }

    function redirectTo(url) {
      var stateName = "";
      switch (url) {
        case "/":
          stateName = "dashboard";
          break;
        case "/#/change_password":
          stateName = "changePassword";
          break;
        case "/#/disclaimer":
          stateName = "disclaimer";
          break;
        case "/#/smart_install/home":
          stateName = "smart_install.home";
          break;
        default:
          stateName = "dashboard";
      }
      console.log("Redirecting to: " + stateName);
      $state.go(stateName);
    }

    return service;
  }
]);
