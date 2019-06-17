"use strict";

//This service is used for retreive the energy chart data
angular.module('conext_gateway.setup').factory('gridCodesRegionService', ['California_R21', 'IEEE1547', 'Prepa',
  function(California_R21, IEEE1547, Prepa) {
    var service = {
      getCaliforniaCodes: getCaliforniaCodes,
      getIEEECodes: getIEEECodes,
      getPrepaCodes: getPrepaCodes
    };

    function getIEEECodes() {
      return IEEE1547;
    }

    function getPrepaCodes() {
      return Prepa;
    }

    function getCaliforniaCodes() {
      return California_R21;
    }

    return service;
  }
]);
