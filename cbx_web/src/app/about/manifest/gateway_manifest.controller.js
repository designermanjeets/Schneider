"use strict";

angular.module('conext_gateway.setup').controller("gatewayManifestController", ['gatewayManifestService', '$scope', '$log',
  function (gatewayManifestService, $scope, $log) {

    gatewayManifestService.getGatewayManifest().then(function (data) {
      $scope.manifest = data.SCB_LSYS_MANIFEST;
    },
    function(error) {
      $log.error("Failed to retreive conext_gateway manifest");
    });
  }
]);
