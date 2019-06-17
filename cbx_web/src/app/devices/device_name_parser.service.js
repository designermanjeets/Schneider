"use strict";

angular.module('conext_gateway.devices').factory('deviceNameParserService', [
  function () {
    var service = {
      parseDeviceName: parseDeviceName,
      formatDeviceName: formatDeviceName
    };

    function parseDeviceName(deviceName) {
      var result = {
        deviceName: '',
        bus: '',
        address: '',
        id: ''
      };

      var delimeter = deviceName.indexOf('(');
      var addressInfo = deviceName.substring(delimeter + 1, deviceName.length - 1).split('-');
      result.deviceName = deviceName.substring(0, delimeter);
      result.bus = (addressInfo[0] === 'A') ? 'BUS1' : 'BUS2';
      result.address = addressInfo[1];
      result.id = (result.bus + '_' + result.deviceName + '_' + result.address).toUpperCase();
      return result;
    }

    function formatDeviceName(deviceName) {
      var attributes = deviceName.split('_');
      var device = "";
      if (attributes.length < 3) {
        return deviceName.toUpperCase();
      }
      if ((attributes[1] === "EM3555" || attributes[1] === "PME51C2" || attributes[1] === "E51C2") && attributes.length === 4 && attributes[3] !== undefined) {
        device = attributes[3];
      } else {
        device = attributes[1];
      }

      return device + '(' + ((attributes[0] === 'BUS1') ? 'A' : 'B') + '-' + attributes[2] + ')';
    }

    return service;
  }
]);
