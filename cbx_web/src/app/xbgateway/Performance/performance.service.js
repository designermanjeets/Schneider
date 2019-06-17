"use strict";

//This service is used for saving and retreiveing device configurations
angular.module('conext_gateway.xbgateway').factory('performanceService', ['$http', 'CSV', 'chartdataService', "paddingService", "$q",
  "startsWith", "moment",
  function($http, CSV, chartdataService, paddingService, $q, startsWith, moment) {

    var service = {
      getPerformanceData: getPerformanceData
    };

    //Fucntion for retreive the device performance chart data, padding it and
    //appling formating
    function getPerformanceData(deviceType, deviceId, dateData, currentDate) {
      var defered = $q.defer();
      chartdataService.getChartData(deviceType, deviceId, dateData).then(function(data) {
        var listOfLines = data.split('\n');
        var result = [];
        var temp = [];
        var formattedLabel;
        var previousLabel = null;
        var index;
        var performanceData = {
          labels: [],
          units: []
        };

        for (var line in listOfLines) {
          if (listOfLines.hasOwnProperty(line) && !startsWith(listOfLines[line], '#') && listOfLines[line].split(' ').join('') !== '') {
            result.push(listOfLines[line] + '\n');
          }
        }

        performanceData.chartlabels = result[0].split(',');
        performanceData.chartlabels = performanceData.chartlabels.splice(1, performanceData.chartlabels.length);

        for (var i = 0; i < performanceData.chartlabels.length; i++) {
          formattedLabel = formatLabel(performanceData.chartlabels[i]);
          temp.push(formattedLabel.label);
          performanceData.units.push(formattedLabel.units);
        }

        performanceData.chartlabels = temp;

        var bucket = {};
        CSV.forEach(result.slice(1, result.legnth).join(''), {}, function(array) {
          if (chartdataService.isDisplayable(currentDate, array[0], dateData.type)) {
            bucket[array[0]] = array.slice(1, array.length);
          }
        });

        var sortedKeys = Object.keys(bucket).sort();

        for (var bucketIndex = 0; bucketIndex < sortedKeys.length; bucketIndex++) {
            var missingLabels = paddingService.getMissingLabels(previousLabel, "" + sortedKeys[bucketIndex]);
            for (var label in missingLabels) {
              if (missingLabels.hasOwnProperty(label)) {
                performanceData.labels.push(missingLabels[label]);
                for (index = 0; index < bucket[sortedKeys[bucketIndex]].length; index++) {
                  if (!performanceData[performanceData.chartlabels[index]]) {
                    performanceData[performanceData.chartlabels[index]] = [];
                  }
                  performanceData[performanceData.chartlabels[index]].push(null);
                }
              }
            }
            previousLabel = "" + sortedKeys[bucketIndex];
            performanceData.labels.push("" + sortedKeys[bucketIndex]);
            for (index = 0; index < bucket[sortedKeys[bucketIndex]].length; index++) {
              if (!performanceData[performanceData.chartlabels[index]]) {
                performanceData[performanceData.chartlabels[index]] = [];
              }
              performanceData[performanceData.chartlabels[index]].push(bucket[sortedKeys[bucketIndex]][index]);
            }
        }

        var endingLabels = paddingService.getEndingLabels(previousLabel);
        for (var label in endingLabels) {
          if (endingLabels.hasOwnProperty(label)) {
            performanceData.labels.push(endingLabels[label]);
            for (index = 0; index < performanceData.chartlabels.length; index++) {
              if (!performanceData[performanceData.chartlabels[index]]) {
                performanceData[performanceData.chartlabels[index]] = [];
              }
              performanceData[performanceData.chartlabels[index]].push(null);
            }
          }
        }

        defered.resolve(performanceData);
      }, function(error) {
        defered.reject(error);
      });
      return defered.promise;
    }

    //Formated the heading of the column and extracts the units
    function formatLabel(label) {
      var words = label.split("/");
      var temp = words[words.length - 1].split("(");
      var units = temp[1].replace(")", "");
      return {
        label: words.slice(1, words.length - 1).join("/") + "/" + temp[0].split("_")[0],
        units: units
      };
    }

    return service;
  }
]);
