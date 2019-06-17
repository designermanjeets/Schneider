"use strict";

angular.module('conext_gateway.devices').factory('faultDescriptionService',
  ['$translate', '$q', '$log',
  function ($translate, $q, $log) {
    var service = {
      faultDescription: faultDescription,
      _deviceTypeToKeyPrefix: deviceTypeToKeyPrefix,
    };
    return service;

    function faultDescription(deviceType, faultCode) {
      var keyPrefix = deviceTypeToKeyPrefix(deviceType);
      if (keyPrefix === null) {
        return $q.reject(null);
      }
      var key = keyPrefix + faultCode;

      return $translate(key)
        .catch(function() {
          $log.error("Unable to find error description. " +
            "Device type: " + deviceType +
            "Fault code: " + faultCode);

          // Show something in the UI.
          return $q.resolve("?");
        })
    }

    function deviceTypeToKeyPrefix(deviceType) {
      // Be flexible in the ways that the device type can be formatted,
      // because deviceType is provided by the back end.
      deviceType = deviceType.replace(/\s+/g, '').toUpperCase();
      if (deviceType.indexOf('CONEXTCL') >= 0) {
        return 'faults_conextcl_short.';
      } else {
        $log.error("Unknown device type: " + deviceType);
        return null;
      }
    }
  }
]);
