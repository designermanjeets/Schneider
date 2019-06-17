"use strict";

angular.module('conext_gateway.utilities').factory('unitFormatterService', [
  function () {
    var service = {
      findGreatestUnit: findGreatestUnit,
    };

    return service;

    function findGreatestUnit(columnNames, rows) {
      var index;
      var result = {};
      angular.forEach(columnNames, function (columnName, key) {
        result[columnName] = "k";
        for (index = 0; index < rows.length; index++) {
          var value = rows[index][columnName];
          if (value > 1e7) {
            result[columnName] = "G";
          }
          if (value > 1e4 && result[columnName] !== "G") {
            result[columnName] = "M";
          }
        }
      });
      return result;
    }
  }
]);
