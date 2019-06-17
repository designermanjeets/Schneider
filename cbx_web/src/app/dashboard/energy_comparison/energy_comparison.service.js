"use strict";

//This service is used for retreive the energy chart data
angular.module('conext_gateway.dashboard').factory('energyComparisonService', ['chartdataService', 'CSV', 'queryService', '$q', 'startsWith',
  'paddingService', 'moment',
  function(chartdataService, CSV, queryService, $q, startsWith, paddingService, moment) {

    var service = {
      getSeriesData: getSeriesData
    };

    //This function is used to get the series chart data
    function getSeriesData(dateInfo, currentDate) {
      var defered = $q.defer();
      chartdataService.getChartData('system', '0', dateInfo).then(function(data) {
        var listOfLines = data.split('\n');
        var result = [];
        var energy_data = {
          labels: [],
          data: [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
          ]
        };

        //ignore commented line from the csv
        for (var line in listOfLines) {
          if (listOfLines.hasOwnProperty(line) && !startsWith(listOfLines[line], '#') && listOfLines[line].split(' ').join('') !== '') {
            result.push(listOfLines[line] + '\n');
          }
        }

        var previousLabel = null;
        var bucket = {};

        CSV.forEach(result.slice(1, result.legnth).join(''), {}, function(array) {
          if (chartdataService.isDisplayable(currentDate, array[0], dateInfo.type)) {
            bucket[array[0]] = array.slice(1, array.length);
          }
        });
        var sortedKeys = Object.keys(bucket).sort();

        for (var bucketIndex = 0; bucketIndex < sortedKeys.length; bucketIndex++) {
          var missingLabels = paddingService.getMissingLabels(previousLabel, "" + sortedKeys[bucketIndex]);
          for (var label in missingLabels) {
            if (missingLabels.hasOwnProperty(label)) {
              energy_data.labels.push(missingLabels[label]);
              energy_data.data[6].push(null);
              energy_data.data[5].push(null);
              energy_data.data[1].push(null);
              energy_data.data[0].push(null);
              energy_data.data[3].push(null);
              energy_data.data[2].push(null);
              energy_data.data[4].push(null);
              energy_data.data[7].push(null);
            }
          }
          previousLabel = "" + sortedKeys[bucketIndex];
          energy_data.labels.push("" + sortedKeys[bucketIndex]);
          energy_data.data[6].push(bucket[sortedKeys[bucketIndex]][0]);
          energy_data.data[5].push(bucket[sortedKeys[bucketIndex]][1]);
          energy_data.data[1].push(bucket[sortedKeys[bucketIndex]][2]);
          energy_data.data[0].push(bucket[sortedKeys[bucketIndex]][3]);
          energy_data.data[3].push(bucket[sortedKeys[bucketIndex]][4]);
          energy_data.data[2].push(bucket[sortedKeys[bucketIndex]][5]);
          energy_data.data[4].push(bucket[sortedKeys[bucketIndex]][6]);
          energy_data.data[7].push(bucket[sortedKeys[bucketIndex]][19]);
        }
        var endingLabels = paddingService.getEndingLabels(previousLabel);
        for (var label in endingLabels) {
          if (endingLabels.hasOwnProperty(label)) {
            energy_data.labels.push(endingLabels[label]);
            energy_data.data[6].push(null);
            energy_data.data[5].push(null);
            energy_data.data[1].push(null);
            energy_data.data[0].push(null);
            energy_data.data[3].push(null);
            energy_data.data[2].push(null);
            energy_data.data[4].push(null);
            energy_data.data[7].push(null);
          }
        }

        defered.resolve(energy_data);
      }, function(error) {
        defered.resolve(null);
      });
      return defered.promise;
    }

    return service;
  }
]);
