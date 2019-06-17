"use strict";

angular.module('conext_gateway.utilities').factory('queryFormatterService', [
  function() {
    var service = {
      createObjectFromQuery: createObjectFromQuery,
      concatQueryObject: concatQueryObject,
      createSetQuery: createSetQuery
    };

    return service;

    function createObjectFromQuery(data, query) {
      var response = {};

      angular.forEach(query, function (value, key) {
        var subresponse = {};
        angular.forEach(value, function (subValue, subkey) {
          subresponse[subValue.replace(/[\.\/]/g, '_')] = getValueFromResult(data, subValue);
        });
        response[key] = subresponse;
      });
      return response;
    }

    function getValueFromResult(data, key) {
      var result;
      angular.forEach(data.values, function (value) {
        if (value.name === key) {
          result = value.value;
        }
      });
      return result;
    }

    function concatQueryObject(queryVars) {
      var result = "";
      angular.forEach(queryVars, function (value) {
        if (result !== "") {
          result += ',';
        } else {
          result += 'name=';
        }
        result += value.join(',');
      });
      return result;
    }

    function createSetQuery(data, queryVars) {
      var keyMap = {};
      var requestObject = {};
      angular.forEach(queryVars, function (value) {
        angular.forEach(value, function(subValue) {
          keyMap[subValue.replace(/[\.\/]/g, '_')] = subValue;
        });
      });

      angular.forEach(data, function(value, key) {
        requestObject[keyMap[key]] = value;
      });

      return requestObject;
    }
  }
]);
