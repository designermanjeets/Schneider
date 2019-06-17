"use strict";

angular.module('conext_gateway.xbgateway').factory('statusService',
['$log', 'queryService', '$q', 'xbConfigUtilityService', '$filter', 'temperatureService',
   function ($log,queryService, $q, xbConfigUtilityService, $filter, temperatureService) {
        var service = {
            getStatusSysvars: getStatusSysvars
        };

        // Function which updates the device details
        function getStatusSysvars(svNames, configs) {
            var queryResult = $q.defer();
            queryService.getSysvars(svNames, {
                keepDeviceId: true
            }).then(function(data) {
                var svRes = processStatusSysvars(data, svNames, configs);
                queryResult.resolve(svRes);
            }, function(error) {
                queryResult.reject(error);
            });
            return queryResult.promise;
        }

        function processStatusSysvars( data, svNames, configs ) {
            var svRes = {};
            for( var idx = 0; idx < svNames.length; idx++ ) {
                var sysVar = processSysvar(svNames[idx], data, configs);
                svRes[normalizeSysvar(svNames[idx])] = sysVar;
            }
            return svRes;
        }

        //Process the sysvars based on the meta object
        function processSysvar(svName, data, configs) {
            var sysVarObj = {
                value: '',
                description: '',
                unit: ''
            };
            var rawValue = data[removeBracketsAndSlashes(svName)];
            var config = configs[removeDeviceID(svName)];

            if (config) {
                config.scale = parseFloat(config.scale);
                config.offset = parseFloat(config.offset);
                sysVarObj.value = xbConfigUtilityService.scaleValue(rawValue, config, 1);
                sysVarObj.description = config.nameRef;
                sysVarObj.unit = config.units;
                if (config.enumRef) {
                    var enumRef = $filter('translate')(config.enumRef);
                    sysVarObj.value = xbConfigUtilityService.findEnumValue(enumRef, sysVarObj.value);
                }
                if(sysVarObj.unit === "degC") {
                  proccessTemperature(sysVarObj);
                }
            }
            return sysVarObj;
        }

        function proccessTemperature(sysVarObj) {
          var tempType = temperatureService.getTemperatureType();
          sysVarObj.value = temperatureService.convert(tempType, sysVarObj.value);
          sysVarObj.unit = temperatureService.getUnitsString(tempType);
          if(sysVarObj.value === "N/A") {
            sysVarObj.unit = "";
          }
        }

        function normalizeSysvar(sysvar) {
          var words = sysvar.split('/');
          return words.slice(2, words.length).join('_');
        }

        function removeBracketsAndSlashes(sysvar) {
            return sysvar.replace('[', '').replace(']', '').split("/").join("_");
        }

        function removeDeviceID(sysvar) {
            var words = sysvar.split('/');
            return "/" + words.slice(1, words.length).join('/');
        }

        function formatSysvarname(sysvar) {
            var words = sysvar.split('/');
            return words.slice(1, words.length).join('_');
        }

        return service;
    }
]);
