"use strict";

angular.module('conext_gateway.xbgateway').factory('xbgatewayService',
  ['queryService','$log',
  function (queryService, $log) {
    var service = {
      getDevices       : getDevices,
    };

    // Return all the devices
    function getDevices() {
        return queryService.getSysvars(['DEVLIST']);
    }

    return service;
  }
]);
