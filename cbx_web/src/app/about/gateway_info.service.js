"use strict";

angular.module('conext_gateway.setup').factory('gatewayInfoService', [
  'queryService',  'objectFormatterService', 'timeToFillCalculatorService', '$log', '$filter',
  function (queryService, objectFormatterService, timeToFillCalculatorService, $log, $filter) {

    var service = {
      getGatewayInfo: getGatewayInfo,
      getEstimatedTimeToFill: getEstimatedTimeToFill,
      getLoggingStatus: getLoggingStatus
    };

    return service;

    // query all sysvars with the Combox:Info tag
    function getGatewayInfo() {
      return queryService.getSysvarsByTags(['Combox:Info'] ).then(function (data) {
          return data;
      },
      function(error) {
          $log.error(error);
      });
    }

    function getEstimatedTimeToFill(data) {
      if (data.SDCARD_SIZE === 0 || data.DATALOGGER_PARAMETER_COUNT === 0 ||
        data.DATALOGGER_LOGGING_INTERVAL === 0 || data.DATALOGGER_OPSTATE === 2 ||
        data.DATALOGGER_OPSTATE === 5 || data.SDCARD_PRESENT === 0) {
        return "\u2013";
      }

      if (data.SDCARD_USED >= data.SDCARD_SIZE) {
        return $filter('translate')('setup.info.no_space');
      }

      var timeToFillInMonths = timeToFillCalculatorService.getTimeToFillInMonths(data);
      var approxTimeYears = Math.floor(timeToFillInMonths / 12);
      var approxTimeMonths = timeToFillInMonths % 12;
      if (approxTimeYears === 0 && approxTimeMonths <= 1) {
        return $filter('translate')('setup.info.less_than_month');
      }

      if (approxTimeYears === 0) {
        return $filter('translate')('setup.info.months', { "months": approxTimeMonths });
      }

      if (approxTimeYears >= 10) {
        return $filter('translate')('setup.info.more_than_ten_years');
      }

      return $filter('translate')('setup.info.years_months', {
        "years": approxTimeYears,
        "months": approxTimeMonths
      });
    }


    function getLoggingStatus(data) {
      if (data.SDCARD_USED >= data.SDCARD_SIZE) {
        return $filter('translate')('setup.info.logging_stopped');
      }
      switch (data.DATALOGGER_OPSTATE) {
        case 0:
          return $filter('translate')('setup.info.logging_in_progress');

        case 1:
          return $filter('translate')('setup.info.logging_in_progress');

        case 2:
          return $filter('translate')('setup.info.no_sd_card');

        case 3:
          return $filter('translate')('setup.info.no_items');

        case 4:
          return $filter('translate')('setup.info.logging_error');

        case 5:
          return $filter('translate')('setup.info.logging_disabled');

        default:
          return $filter('translate')('setup.info.logging_error');
      }
    }


  }
]);
