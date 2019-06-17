"use strict";

angular.module('conext_gateway.setup').factory('gatewayManifestService', [
  'queryService', '$log', '$filter',
  function (queryService, $log, $filter) {

    var service = {
      getGatewayManifest: getGatewayManifest,
    };

    return service;

    function getGatewayManifest() {
      return queryService.getSysvars(['/SCB/LSYS/MANIFEST'] ).then(function (data) {
          return data;
      },
      function(error) {
          $log.error(error);
      });
    }
  }
]);
