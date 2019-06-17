"use strict";

angular.module('conext_gateway.events').factory('faultWarningService', [
  'queryService',
  function (queryService) {
    return {
      getActiveFaults: getActiveFaults,
      getHistoricalFaults: getHistoricalFaults,
      getActiveWarnings: getActiveWarnings,
      getHistoricalWarnings: getHistoricalWarnings
    };

    function getActiveFaults() {
      return queryService.getMatchingSysvars({ 'regex': '(\/FLT\/LIST|\/WRN\/LIST)$' }, { 'keepDeviceId': true, 'lang': 'en'});
    }

    function getHistoricalFaults() {
      return queryService.getMatchingSysvars({ 'match': '/FLT/LOG'}, { 'keepDeviceId': true, 'lang': 'en'});
    }

    function getActiveWarnings() {
      return queryService.getMatchingSysvars({ 'match': '/WRN/LIST'}, { 'keepDeviceId': true, 'lang': 'en'});
    }

    function getHistoricalWarnings() {
      return queryService.getMatchingSysvars({ 'regex': '(\/FLT\/LOG|\/WRN\/LOG)$' }, { 'keepDeviceId': true, 'lang': 'en'});
    }
  }
]);
