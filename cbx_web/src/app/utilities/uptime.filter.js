"use strict";

angular.module('conext_gateway.utilities').filter('uptime', ["moment", "$filter", function(moment, $filter) {
  return function(minutes) {
    var result = "";
    if (minutes !== undefined && minutes !== null) {
      var duration = moment.duration(minutes, 'minutes');
      if (duration.days() !== 0) {
        result += duration.days() + " " + $filter('translate')('utilities.uptime.days') + ", ";
      }

      if (duration.days() !== 0 || duration.hours() !== 0) {
        result += duration.hours() + " " + $filter('translate')('utilities.uptime.hours') + ", ";
      }

      result += duration.minutes() + " " + $filter('translate')('utilities.uptime.minutes');
    }
    return result;

  };
}]);
