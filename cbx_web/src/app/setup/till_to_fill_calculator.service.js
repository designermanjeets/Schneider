"use strict";

angular.module('conext_gateway.setup').factory('timeToFillCalculatorService', [
  function () {

    var SECONDS_PER_MONTH = 60 * 60 * 24 * 30;

    var service = {
      getTimeToFillInMonths: getTimeToFillInMonths
    };

    return service;


    function getTimeToFillInMonths(data) {
      return Math.round(((data.SDCARD_SIZE - data.SDCARD_USED) * 1000000) / ((10 * data.DATALOGGER_PARAMETER_COUNT) / data.DATALOGGER_LOGGING_INTERVAL) / SECONDS_PER_MONTH);
    }
  }
]);
