"use strict";

// Configuration for queryService. These can be overridden by unit tests
// that need to tweak behaviour.

angular.module('conext_gateway.query').factory('queryConfigService', [
  '$q',
  function($q) {
    return {
      willCheckForMissingSysvars : willCheckForMissingSysvars,
    };

    function willCheckForMissingSysvars() {
      return true;
    }
  }
]);
