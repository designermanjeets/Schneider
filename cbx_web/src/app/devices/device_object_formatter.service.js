"use strict";

angular.module('conext_gateway.devices').factory('deviceObjectFormatterService', ['objectFormatterService',
  function (objectFormatterService) {
    var service = {
      formatDeviceObject: formatDeviceObject
    };

    function formatDeviceObject(rawObject, deviceId) {
      var newObject = objectFormatterService.formatObject(rawObject, deviceId.toUpperCase());
      newObject["PRODUCT_NAME"] = deviceId.substring(deviceId.indexOf('_') + 1, deviceId.lastIndexOf('_'));

      return newObject;
    }


    return service;
  }
]);
