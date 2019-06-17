"use strict";

//This service is used for saving and retreiveing device configurations
angular.module('conext_gateway.dashboard').factory('batterySummaryService', ['chartdataService', 'CSV', 'queryService', '$q',
  'startsWith', 'paddingService', 'scalingService', 'moment',
  function(chartdataService, CSV, queryService, $q, startsWith, paddingService, scalingService, moment) {

    var service = {
      getBatterySummary: getBatterySummary,
    };

    //Fucntion to get the chart data, process the csv into a json object
    function getBatterySummary(device, deviceId, dateData, currentDate) {
      return chartdataService.getChartData(device, deviceId, dateData).then(function(data) {
        var listOfLines = data.split('\n');
        var result = [];
        var previousLabel = null;
        var battery_data = {
          labels: [],
          battery1: {
            data: {}
          },
          battery2: {
            data: {}
          },
          battery3: {
            data: {}
          },
          battery4: {
            data: {}
          },
          battery5: {
            data: {}
          }
        };
        for (var line in listOfLines) {
          if (listOfLines.hasOwnProperty(line) && !startsWith(listOfLines[line], '#') && listOfLines[line].split(' ').join('') !== '') {
            result.push(listOfLines[line] + '\n');
          }
        }

        var columnsLabels = result[0].split(',');
        battery_data.battery1.chartlabels = columnsLabels.slice(5, 9);
        battery_data.battery2.chartlabels = columnsLabels.slice(9, 13);
        battery_data.battery3.chartlabels = columnsLabels.slice(13, 17);
        battery_data.battery4.chartlabels = columnsLabels.slice(17, 21);
        battery_data.battery5.chartlabels = columnsLabels.slice(21, 25);

        var bucket = {};
        CSV.forEach(result.slice(1, result.legnth).join(''), {}, function(array) {
          if (chartdataService.isDisplayable(currentDate, array[0], dateData.type)) {
            bucket[array[0]] = array.slice(1, array.length);
          }
        });

        var sortedKeys = Object.keys(bucket).sort();

        for (var bucketIndex = 0; bucketIndex < sortedKeys.length; bucketIndex++) {

            var missingLabels = paddingService.getMissingMinuteLabels(previousLabel, "" + sortedKeys[bucketIndex]);
            for (var label in missingLabels) {
              if (missingLabels.hasOwnProperty(label)) {
                battery_data.labels.push(missingLabels[label]);
                for (var batteryCounter = 1; batteryCounter < 6; batteryCounter++) {
                  if (!battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[0]]) {
                    battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[0]] = {
                      scale: {
                        min: null,
                        max: null
                      },
                      data: []
                    };
                  }
                  if (!battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[1]]) {
                    battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[1]] = {
                      scale: {
                        min: null,
                        max: null
                      },
                      data: []
                    };
                  }
                  if (!battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[2]]) {
                    battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[2]] = {
                      scale: {
                        min: null,
                        max: null
                      },
                      data: []
                    };
                  }
                  if (!battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[3]]) {
                    battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[3]] = {
                      scale: {
                        min: null,
                        max: null
                      },
                      data: []
                    };
                  }
                  battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[0]].data.push(null);
                  battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[1]].data.push(null);
                  battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[2]].data.push(null);
                  battery_data['battery' + batteryCounter].data[battery_data['battery' + batteryCounter].chartlabels[3]].data.push(null);
                }
              }
            }

            previousLabel = sortedKeys[bucketIndex];
            battery_data.labels.push(sortedKeys[bucketIndex]);
            var batteryIndex = 1;
            for (var index = 4; index < 24; index += 4) {
              if (!battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[0]]) {
                battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[0]] = {
                  scale: {
                    min: null,
                    max: null
                  },
                  data: []
                };
              }
              if (!battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[1]]) {
                battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[1]] = {
                  scale: {
                    min: null,
                    max: null
                  },
                  data: []
                };
              }
              if (!battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[2]]) {
                battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[2]] = {
                  scale: {
                    min: null,
                    max: null
                  },
                  data: []
                };
              }
              if (!battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[3]]) {
                battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[3]] = {
                  scale: {
                    min: null,
                    max: null
                  },
                  data: []
                };
              }

              battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[0]].data.push(bucket[sortedKeys[bucketIndex]][index] / 1000);
              scalingService.setScale(battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[0]].scale, bucket[sortedKeys[bucketIndex]][index] / 1000);
              battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[1]].data.push(bucket[sortedKeys[bucketIndex]][index + 1] / 1000);
              scalingService.setScale(battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[1]].scale, bucket[sortedKeys[bucketIndex]][index + 1] / 1000);
              battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[2]].data.push((bucket[sortedKeys[bucketIndex]][index + 2] * 0.01) - 273);
              scalingService.setScale(battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[2]].scale, (bucket[sortedKeys[bucketIndex]][index + 2] * 0.01) - 273);
              battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[3]].data.push(bucket[sortedKeys[bucketIndex]][index + 3]);
              scalingService.setScale(battery_data['battery' + batteryIndex].data[battery_data['battery' + batteryIndex].chartlabels[3]].scale, bucket[sortedKeys[bucketIndex]][index + 3]);
              batteryIndex++;
            }
        }
        return battery_data;
      }, function(error) {
        return $q.reject(error);
      });
    }

    return service;
  }
]);
