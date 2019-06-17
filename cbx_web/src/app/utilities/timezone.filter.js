"use strict";

angular.module('conext_gateway.utilities').filter('timezoneIdToStringId', [
  'timezoneService',
  function(timezoneService) {
  return function(timezoneId) {
    return timezoneService.translationKeyForTimezoneId(timezoneId);
  }
}]);
