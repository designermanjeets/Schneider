"use strict";

angular.module('conext_gateway.smart_install').factory('smartInstallService', [
  function () {

    var service = {
      validatePower: validatePower,
      validateFQDN: validateFQDN,
      checkSNTPInterval: checkSNTPInterval
    };

    return service;

    function validatePower(string) {
      // Make sure that power has the right number of decimal places.
      // DOES NOT ensure that power is in bounds.
      var positiveRegEx = /^\d+(\.\d{1})?$/;// \d(?=.*\d)*(?:\.\d\d)?//^[0-9]*(\.[0-9]{1,2})?$
      if (positiveRegEx.test($.trim(string))) {
        return true;
      } else {
        return false;
      }
    }

    // Function that validates FQDN address through a regular expression.
    function validateFQDN(fqdnString) {
      var fqdnregex = /^(?=^.{1,254}$)(^(?:(?!\d+\.)[a-zA-Z0-9_\-]{1,63}\.?)+(?:[a-zA-Z]{2,})$)$/;
      var ipregex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
      var isError = 0;

      var parts = fqdnString.split(".");
      if (parts.length === 1) {
        isError = 1;
      } else if ((parts[0] === "") || (parts[parts.length - 1] === "")) {
        isError = 1;
      } else if (parts.length >= 2 && parts.length <= 3) {
        if (fqdnregex.test($.trim(fqdnString))) {
          isError = 0;
        } else {
          isError = 1;
        }
      } else {
        if (parts[0] < 1 || parts[0] > 247 || parts[1] < 1 || parts[1] > 247 || parts[2] < 1 || parts[2] > 247 || parts[3] < 1 || parts[3] > 247) {
          isError = 1;
        } else if ((ipregex.test($.trim(fqdnString))) || (fqdnregex.test($.trim(fqdnString)))) {
          isError = 0;
        } else {
          isError = 1;
        }

      }
      if (isError === 0) {
        return true;
      } else {
        return false;
      }
    }

    // Function that validates Numbers upto 3 digits through a regular
    // expression.
    function checkSNTPInterval(sntpPollInterval) {
      var filter = /^[0-9]{1,4}$/;
      if (filter.test($.trim(sntpPollInterval))) {
        return true;
      } else {
        return false;
      }
    }
  }
]);
