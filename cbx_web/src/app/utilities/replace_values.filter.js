"use strict";

angular.module('conext_gateway.utilities').filter('replaceNull',
  ['NDASH',
  function(NDASH) {
  return function(value, replacement) {
    if (replacement === undefined) {
      replacement = "N/A";
    }
    else if (replacement === 'ndash') {
      // pass in string ndash as a substitute for the actual ndash
      replacement = NDASH;
    }

    if (value === undefined || value === null) {
      return replacement;
    }
    else {
      return value;
    }
  }
}]);

angular.module('conext_gateway.utilities').filter('replace0xFFFF', [function() {
  return function(value) {
    return (Number(value) === 0xFFFF) ? "N/A" : value;
  }
}]);

// This is a cheap hack, to remove the huge values until we get proper
// quality bits together.
angular.module('conext_gateway.utilities').filter('replaceMaxFloat',
  ['NDASH',
  function(NDASH) {
  return function(value) {
    // Values of max float come across the wire as 340282346638528859811550000000000000000.000000.
    // Do a rough comparison, just to avoid issues with floating point accuracy,
    // and the effects of the number filter, and etc.
    if (angular.isDefined(value) && value !== null && value > 3e38) {
      return NDASH;
    }
    else {
      return value;
    }
  }
}]);

angular.module('conext_gateway.utilities').filter('makeDashIf', ['NDASH', function(NDASH) {
  return function (value, isCommError) {
    if (!angular.isDefined(value)) {
      return NDASH;
    }
    if (angular.isString(value) && (value.toLowerCase() === 'nan' || value === "" || value === "--")) {
      return NDASH;
    }
    return isCommError ? NDASH : value;
  }
}]);
