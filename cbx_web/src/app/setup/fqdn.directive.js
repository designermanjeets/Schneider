"use strict";
angular.module('conext_gateway.setup').directive("fqdn", function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, ele, attrs, ctrl) {

      ctrl.$validators.fqdn = function FQDN(value) {
        if (value && attrs.fqdn === '1') {
          return validateFQDN(value);
        }
        return true;
      }
    }
  }

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
      if (parts[0] < 1 || parts[0] > 255 || parts[1] < 1 || parts[1] > 255 || parts[2] < 1 || parts[2] > 255 || parts[3] < 1 || parts[3] > 255) {
        isError = 1;
      } else if ((ipregex.test($.trim(fqdnString))) || (fqdnregex.test($.trim(fqdnString)))) {
        isError = 0;
      } else {
        isError = 1;
      }

    }
    if (isError === 0) {
      return true;
    }
    else {
      return false;
    }
  }
});
