"use strict";

angular.module('conext_gateway.utilities').factory('otkService', [
  function() {
    var otk;

    return {
      getOTK: getOTK,
      setOTK: setOTK
    };

    function getOTK() {
      return otk;
    }

    function setOTK(newOTK) {
      otk = newOTK;
    }
  }
]);
