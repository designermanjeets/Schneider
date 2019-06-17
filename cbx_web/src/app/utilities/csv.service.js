"use strict";

angular.module('conext_gateway.utilities').factory('csvService',
  ['$log', 'CSV', 'saveAs',
  function ($log, CSV, saveAs) {
    return {
      saveCsv: saveCsv,

      _getCsvString: getCsvString,
    };

    // Convert the CSV data to a string, to then be saved
    function getCsvString(csvData, csvOptions) {
      csvOptions = angular.extend({}, csvOptions);

      // CSBQNX-532: The CSV service converts null and undefined to
      // "null" and "undefined" (but only if they occur on the
      // second line or subsequent lines; not if they occur on
      // the first line). So convert them to empty strings
      // before passing to CSV.
      csvData.forEach(function(row) {
        for (var colIdx = 0; colIdx < row.length; colIdx++) {
          var dataValue = row[colIdx];
          row[colIdx] = (dataValue == null) ? "" : dataValue;
        }
      });

      var csvObj = new CSV(csvData, csvOptions);
      // Convert the arrays to a string
      var csvStr = csvObj.encode();

      return csvStr;
    }

    function saveCsv(filename, csvData, csvOptions /* optional */) {
      var csvStr = getCsvString(csvData, csvOptions);

      // Manually add a UTF8 BOM at the start of the file
      if (csvStr !== '') {
        csvStr = '\ufeff' + csvStr;
      }
      // TODO: Should make Blob into an angular constant
      /* global Blob */
      var blob = new Blob([csvStr], { type: "text/csv" });

      var DISABLE_AUTO_BOM = true;
      saveAs(blob, filename, DISABLE_AUTO_BOM);
    }
  }
]);
