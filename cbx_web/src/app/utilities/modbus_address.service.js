"use strict";

angular.module('conext_gateway.utilities').factory('modbusAddressService',
  ['$log',
  function ($log) {

    return {
      parseModbusAddress: parseModbusAddress,
      extractModbusAddress: extractModbusAddress,
      compareAddresses: compareAddresses,
    }

    // Given a string that consists entirely of a modbus address,
    // parse that address.
    function parseModbusAddress(modbusAddress) {
      var match = modbusAddress.match(/^([AB])-(\d+)$/)
      if (match === null) {
        $log.error("parseModbusAddress: Bad modbus address: " + modbusAddress);
        return;
      }
      return {
        bus:     match[1],
        address: parseInt(match[2], 10),
      };
    }

    // Find the first modbusAddress in string, and parse it.
    // string might be a device name like "ConextCL(A-7)"
    function extractModbusAddress(string) {
      var match = string.match(/[AB]-\d{1,3}/);
      if (match === null) {
        return null;
      }
      else {
        return parseModbusAddress(match[0]);
      }
    }

    // Return:
    // -1 if a <  b
    //  0 if a == b
    // +1 if a >  b
    function compareAddresses(a, b) {
      if (!angular.isDefined(a.bus) || !angular.isDefined(b.bus) ||
        !angular.isDefined(a.address) || !angular.isDefined(b.address)) {

        $log.error("compareAddresses: bad arguments")
      }

      if (a.bus === b.bus) {
        if (a.address === b.address) {
          return 0;
        }
        else if (a.address < b.address) {
          return -1;
        }
        else {
          return 1;
        }
      }
      else if (a.bus < b.bus) {
        return -1;
      }
      else {
        return 1;
      }
    }
  }
]);
