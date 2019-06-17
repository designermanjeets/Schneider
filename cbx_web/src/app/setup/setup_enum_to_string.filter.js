"use strict";

// Parity bit for modbus
angular.module('conext_gateway.setup').filter('parity',
  ['$log', '$translate', '$filter',
  function ($log, $translate, $filter) {
  return function (input) {
    var stringId = null;
    switch (input) {
      case undefined:
      case null:
      case "":
        break;

      case 0: stringId = "setup.parity.odd";  break;
      case 1: stringId = "setup.parity.even"; break;
      case 2: stringId = "setup.parity.none"; break;

      default:
        $log.error("Unknown parity: " + input)
        break;
    }

    if (stringId !== null) {
      return $filter('translate')(stringId);
    }
    else {
      return "";
    }
  }
}]);
