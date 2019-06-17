"use strict";

angular.module('conext_gateway.xbgateway').factory('xbdevlistService', ['queryService', '$log', '$q', 'xbConfigUtilityService', '$http', '$filter',
 'sysvar_metadata', 'temperatureService',
  function(queryService, $log, $q, xbConfigUtilityService, $http, $filter, sysvar_metadata, temperatureService) {
    var service = {
      getDevices: getDevices,
      getDevList: getDevList,
      refreshDeviceInformation: refreshDeviceInformation,
      getConfig: getConfig,
      setOperating: setOperating,
      setStandby: setStandby
    };

    function setOperating(devlist) {
      var sysVars = [];

      for (var index = 0; index < devlist.length; index++) {
        if(devlist[index].attributes.interface === 'xanbus') {
          var setting = {};
          setting['[' + devlist[index].instance + ']/' + devlist[index].name + '/DEV/CFG_OPMODE'] = 3;
          sysVars.push(setting);
        }
      }

      return queryService.setSysvars(sysVars);
    }

    function setStandby(devlist) {
      var sysVars = [];
      for (var index = 0; index < devlist.length; index++) {
        if(devlist[index].attributes.interface === 'xanbus') {
          var setting = {};
          setting['[' + devlist[index].instance + ']/' + devlist[index].name + '/DEV/CFG_OPMODE'] = 2;
          sysVars.push(setting);
        }
      }

      return queryService.setSysvars(sysVars);
    }

    // Return all the xb devices
    //TODO remove function
    function getDevices() {
      return queryService.getSysvars(['DEVLIST']);
    }

    function getConfig() {
      return $q.resolve(sysvar_metadata);
    }

    // Return all devices
    function getDevList() {
      var sysVars = ['DEVLIST', '/SCB/DEVSERVER/COUNTER'];
      return queryService.getSysvars(sysVars, {});
    }

    // Function which updates the device details
    function refreshDeviceInformation(devices, queryVars, configs) {
      var queryResult = $q.defer();
      var query = ['/SCB/DEVSERVER/COUNTER'];
      query.push.apply(query, queryVars);
      queryService.getSysvars(query, {
        keepDeviceId: true
      }).then(function(data) {
        processDevices(devices, data, configs);
        queryResult.resolve(data.SCB_DEVSERVER_COUNTER);
      }, function(error) {
        queryResult.reject(error);
      });
      return queryResult.promise;
    }

    // function to parse the data from the response and updates the device object
    function processDevices(devices, data, configs) {
      for (var deviceType in devices) {
        if (devices.hasOwnProperty(deviceType)) {
          for (var deviceIndex = 0; deviceIndex < devices[deviceType].length; deviceIndex++) {
            var sysVars = devices[deviceType][deviceIndex].sysVars;
            devices[deviceType][deviceIndex].status = [];
            for (var sysVarIndex = 0; sysVarIndex < sysVars.length; sysVarIndex++) {
              var sysVar = processSysvar(sysVars[sysVarIndex], data, configs);
              devices[deviceType][deviceIndex].status.push(sysVar);
            }
          }
        }
      }
    }

    //Process the sysvars based on the meta object
    function processSysvar(sysVar, data, configs) {
      var sysVarObj = {};
      var rawValue = data[removeBracketsAndSlashes(sysVar)];
      var config = configs[removeDeviceID(sysVar)];

      if (config) {
        config.scale = parseFloat(config.scale);
        config.offset = parseFloat(config.offset);
        sysVarObj.value = xbConfigUtilityService.scaleValue(rawValue, config);
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
