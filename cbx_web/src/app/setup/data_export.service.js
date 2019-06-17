"use strict";

angular.module('conext_gateway.setup').factory('dataExportService', [
  'csbQuery', 'queryFormatterService',
  function(csbQuery, queryFormatterService) {

    var service = {
      getTimeData: getTimeData
    };

    return service;

    function getTimeData() {
      var query = [
        'TIME/LOCAL_ISO_STR',
        'TIMEZONE',
        'MBSYS/PLANT_INSTALLED.YEAR',
      ];
      return csbQuery.getObj(query);
    }
  }
]);
