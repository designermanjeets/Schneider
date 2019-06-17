"use strict";

//This service is used apply scale and offset to a value and to also remove the scale
//and offset
angular.module('conext_gateway.xbgateway').factory('xbConfigUtilityService', [
  function() {

    var service = {
      scaleValue: scaleValue,
      removeScaling: removeScaling,
      splitEnums: splitEnums,
      getPrecision: getPrecision,
      findEnumValue: findEnumValue
    }

    function scaleValue(rawValue, scaleObject, fixedValue) {
      var returnValue;
      if (rawValue === undefined) {
        returnValue = "";
      } else if (typeof rawValue === 'string' || rawValue instanceof String) {
        returnValue = rawValue;
      } else {
        returnValue = parseFloat(((rawValue * scaleObject.scale) + scaleObject.offset).toFixed(((fixedValue) ? fixedValue : getFixedValue(scaleObject.scale))));
      }
      return returnValue;
    }

    function getFixedValue(scale) {
      var splitScale = ("" + scale).split('.');
      if(splitScale.length > 1) {
        for(var i = 0; i < splitScale[1].length; i++) {
          if(splitScale[1][i] !== '0') {
            return i + 1;
          }
        }
        return 0;
      } else {
        return 0;
      }
    }

    function removeScaling(scaleSettings, value) {
      var scaledValue = value;
      if (scaleSettings.offset !== undefined && scaleSettings.offset !== 0) {
        scaledValue = scaledValue - scaleSettings.offset;
      }
      if (scaleSettings.scale !== undefined && scaleSettings.scale !== 1) {
        scaledValue = (scaledValue / scaleSettings.scale).toFixed(getFixedValue(scaleSettings.scale)) / 1;
      }
      return scaledValue;
    }

    function splitEnums(enumRef) {
      var enums = enumRef.split(',');
      var options = [];

      for (var key in enums) {
        if (enums.hasOwnProperty(key)) {
          var keyValue = enums[key].split('=');
          options.push({
            key: keyValue[0],
            value: keyValue[1]
          });
        }
      }
      return options;
    }

    function findEnumValue(enumRef, value) {
      var enums = enumRef.split(',');
      var enumValue = "";

      for (var key in enums) {
        if (enums.hasOwnProperty(key)) {
          var keyValue = enums[key].split('=');
          if(String(value) === keyValue[0]) {
              enumValue = keyValue[1];
          }
        }
      }
      return enumValue;
    }

    function getPrecision(scale) {
      var precision = 0;
      if (Math.abs(scale) < 1) {
        return 1;
      }
      return precision;
    }

    return service
  }
]);
