"use strict";

// Inverters have an enum that describes the mode they're operating in.
// Convert that enum to a string.
//
angular.module('conext_gateway.devices').filter('operationMode',
  ['$filter', 'NDASH',
  function ($filter, NDASH) {
    var t = function (id) { return $filter('translate')(id); }

    return function (input, modelName) {
      var value = Number(input);
      if (input === "" || input === null || isNaN(value)) {
        value = input;
      }


      switch (value) {
        case undefined:
        case null:
        case "":
          return null;

          // Pass through NDASH. And sometimes the back-end
          // sends "--", too.
        case NDASH:
        case "--":
          return NDASH;

        default:
          break;

      }

      if ((modelName !== undefined) && (modelName.indexOf("CL60") !== -1) )
      {
        switch (value) {

            // The values in this enum are  taken from the following
            // document: Modbus Register Map - Conext CL 60E & CL 60A
          case 0: return t("devices.operation_mode.run");
          case 0x8000: return t("devices.operation_mode.stop");
          case 0x1300: return t("devices.operation_mode.key_stop");
          case 0x1500: return t("devices.operation_mode.emergency_stop");
          case 0x1400: return t("devices.operation_mode.standby");
          case 0x1200: return t("devices.operation_mode.initial_standby");
          case 0x1600: return t("devices.operation_mode.starting");
          case 0x9100: return t("devices.operation_mode.alarm");
          case 0x8100: return t("devices.operation_mode.derating");
          case 0x8200: return t("devices.operation_mode.dispatch");
          case 0x5500: return t("devices.operation_mode.fault");
          default: return "";
        }
      }
      else
      {
        switch (value) {

            // The values in this enum are  taken from the following
            // document: ConextCL_RenConnectSpecs.xls which can be found in
            // the following location: https://sesolar-confluence.atlassian.net/wiki/display/OG/HB1.0+related
            //
            // NOTE: In that spreadsheet, the "Monitoring" tab has bad
            // values -- e.g., it shows Offline as 16 not 0x16. Correct
            // values are in the "Conext-CL Modubs Regs" tab.
          case 2: return t("devices.operation_mode.reconnecting");
          case 3: return t("devices.operation_mode.online");
          case 20: return t("devices.operation_mode.standby");
          case 21: return t("devices.operation_mode.no_dc");
          case 22: return t("devices.operation_mode.offline");
          case 23: return t("devices.operation_mode.derating");
          default: return "";
        }

      }

    }
  }]);

angular.module('conext_gateway.devices').filter('threePhaseLoss',
  ['$filter',
  function ($filter) {
    var t = function (id) { return $filter('translate')(id); }

    return function (input) {

      switch (input) {
        case undefined:
        case null:
        case "":
          return null;

        case 10: return t("devices.three_phase_loss.a_plus_n");
        case 11: return t("devices.three_phase_loss.a_plus_b");
        case 12: return t("devices.three_phase_loss.a_plus_b_plus_n");
        case 31: return t("devices.three_phase_loss.three_phase_delta");
        case 40: return t("devices.three_phase_loss.three_phase_y");

        default: return "";
      }
    }
  }]);

angular.module('conext_gateway.devices').filter('outputType',
['$filter', 'NDASH', function ($filter, NDASH) {
  var t = function (id) { return $filter('translate')(id); }
  return function (input) {
    switch (input) {
      case 0:
        return t("devices.details.output_type_0");
      case 1:
        return t("devices.details.output_type_1");
      case 2:
        return t("devices.details.output_type_2");
      default:
        return NDASH;
    }
  }
}]);

angular.module('conext_gateway.devices').filter('inverterFilter',
[ function () {
  return function (input) {
    return input;
  }
}]);
