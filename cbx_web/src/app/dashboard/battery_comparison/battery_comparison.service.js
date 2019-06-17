"use strict";

//This service is used for saving and retreiveing device configurations
angular.module('conext_gateway.dashboard').factory('batteryComparisonService', ['chartdataService', 'CSV', 'queryService', '$q',
  'startsWith', 'paddingService', 'scalingService', 'moment',
  function(chartdataService, CSV, queryService, $q, startsWith, paddingService, scalingService, moment) {

    var service = {
      getBatteryComparisonData: getBatteryComparisonData,
    };

    //Fucntion to get the chart data, process the csv into a json object
    function getBatteryComparisonData(device, deviceId, dateData, currentDate) {
      return chartdataService.getChartData(device, deviceId, dateData).then(function(data) {
        var listOfLines = data.split('\n');
        var result = [];
        var previousLabel = null;
        var battery_data = {
          labels: [],
          volts: {
            data: {}
          },
          current: {
            data: {}
          },
          temperature: {
            data: {}
          },
          stateOfCharge: {
            data: {}
          },
        };

        for (var line in listOfLines) {
          if (listOfLines.hasOwnProperty(line) && !startsWith(listOfLines[line], '#') && listOfLines[line].split(' ').join('') !== '') {
            result.push(listOfLines[line] + '\n');
          }
        }

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
                  if (!battery_data.volts.data['battery' + batteryCounter]) {
                    battery_data.volts.data['battery' + batteryCounter] = {
                      scale: {
                        min: null,
                        max: null
                      },
                      data: []
                    };
                  }
                  if (!battery_data.current.data['battery' + batteryCounter]) {
                    battery_data.current.data['battery' + batteryCounter] = {
                      scale: {
                        min: null,
                        max: null
                      },
                      data: []
                    };
                  }
                  if (!battery_data.temperature.data['battery' + batteryCounter]) {
                    battery_data.temperature.data['battery' + batteryCounter] = {
                      scale: {
                        min: null,
                        max: null
                      },
                      data: []
                    };
                  }
                  if (!battery_data.stateOfCharge.data['battery' + batteryCounter]) {
                    battery_data.stateOfCharge.data['battery' + batteryCounter] = {
                      scale: {
                        min: null,
                        max: null
                      },
                      data: []
                    };
                  }

                  battery_data.volts.data['battery' + batteryCounter].data.push(null);
                  battery_data.current.data['battery' + batteryCounter].data.push(null);
                  battery_data.temperature.data['battery' + batteryCounter].data.push(null);
                  battery_data.stateOfCharge.data['battery' + batteryCounter].data.push(null);
                }
              }
            }

            previousLabel = sortedKeys[bucketIndex];
            battery_data.labels.push(sortedKeys[bucketIndex]);
            var batteryIndex = 1;
            for (var index = 4; index < 24; index += 4) {
              if (!battery_data.volts.data['battery' + batteryIndex]) {
                battery_data.volts.data['battery' + batteryIndex] = {
                  scale: {
                    min: null,
                    max: null
                  },
                  data: []
                };
              }
              if (!battery_data.current.data['battery' + batteryIndex]) {
                battery_data.current.data['battery' + batteryIndex] = {
                  scale: {
                    min: null,
                    max: null
                  },
                  data: []
                };
              }
              if (!battery_data.temperature.data['battery' + batteryIndex]) {
                battery_data.temperature.data['battery' + batteryIndex] = {
                  scale: {
                    min: null,
                    max: null
                  },
                  data: []
                };
              }
              if (!battery_data.stateOfCharge.data['battery' + batteryIndex]) {
                battery_data.stateOfCharge.data['battery' + batteryIndex] = {
                  scale: {
                    min: null,
                    max: null
                  },
                  data: []
                };
              }

              battery_data.volts.data['battery' + batteryIndex].data.push(bucket[sortedKeys[bucketIndex]][index] / 1000);
              scalingService.setScale(battery_data.volts.data['battery' + batteryIndex].scale, bucket[sortedKeys[bucketIndex]][index] / 1000);
              battery_data.current.data['battery' + batteryIndex].data.push(bucket[sortedKeys[bucketIndex]][index + 1] / 1000);
              scalingService.setScale(battery_data.current.data['battery' + batteryIndex].scale, bucket[sortedKeys[bucketIndex]][index + 1] / 1000);
              battery_data.temperature.data['battery' + batteryIndex].data.push((bucket[sortedKeys[bucketIndex]][index + 2] * 0.01) - 273);
              scalingService.setScale(battery_data.temperature.data['battery' + batteryIndex].scale, (bucket[sortedKeys[bucketIndex]][index + 2] * 0.01) - 273);
              battery_data.stateOfCharge.data['battery' + batteryIndex].data.push(bucket[sortedKeys[bucketIndex]][index + 3]);
              scalingService.setScale(battery_data.stateOfCharge.data['battery' + batteryIndex].scale, bucket[sortedKeys[bucketIndex]][index + 3] / 1000);
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
