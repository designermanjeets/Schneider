"use strict";

angular.module('conext_gateway.utilities').factory('temperatureService', [
  '$log',
  function ($log) {
    var temptype = 'F';
    var service = {
      getUnitsString: getUnitsString,
      convert: convert,
      setTemperatureType: setTemperatureType,
      getTemperatureType: getTemperatureType
    };

    return service;

    function setTemperatureType(newTempType) {
      temptype = newTempType;
    }

    function getTemperatureType() {
      return temptype;
    }

    function isFarenheit(temperatureType) {
     switch (temperatureType) {
        case 'F':
          return true;
        case 'C':
          return false;
        default:
          $log.error("setTemperatureType(): Unknown type: " + temperatureType);
          return;
      }
    }

    function getUnitsString(temperatureType) {
      return isFarenheit(temperatureType) ? '°F' : '°C';
    }

    function convert(temperatureType, degreesC) {
      // Pass non-numeric things through unchanged.
      // Can't use angular.isNumber(), because that
      // won't include numeric strings.

      if(degreesC === -273) {
        return "N/A";
      }

      var value = parseFloat(degreesC, 10);

      if (isNaN(value)) {
        return degreesC;
      }
      degreesC = value;

      if (isFarenheit(temperatureType)) {
        return (degreesC * 1.8 + 32).toFixed(2);
      }
      else {
        return degreesC.toFixed(2);
      }
    }
  }
]);
