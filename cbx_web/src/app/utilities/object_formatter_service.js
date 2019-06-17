"use strict";

angular.module('conext_gateway.utilities').factory('objectFormatterService', [
  function () {
    var service = {
      formatObject: formatObject
    };

    function formatObject(rawObject, prefix) {
      var newObject = {};

      for (var i = 0; i < rawObject.values.length; i++) {
        var attributeName = formatAttributeName(rawObject.values[i].name, prefix);
        newObject[attributeName] = rawObject.values[i].value;
      }
      return newObject;
    }

    function formatAttributeName(attributeName, prefix) {
      var result = attributeName;
      if (prefix !== undefined) {
        result = attributeName.replace(prefix + '.', "");
      }

      var name = result.replace(/[\.\/]/g,'_' );
      return name.replace(/^_/g, '');
    }

    return service;
  }
]);
