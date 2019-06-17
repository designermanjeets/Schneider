"use strict";

angular.module('conext_gateway.devices').factory('sensorDetailsService', [
  'queryService','csbQuery', 'deviceObjectFormatterService', '$q', '$log',
  'deviceNameParserService', 'deadDeviceService',
  function (queryService, csbQuery, deviceObjectFormatterService, $q, $log,
    deviceNameParserService, deadDeviceService) {
    var service = {
      getSensorDetails: getSensorDetails,
      setUnknownDeviceType: setUnknownDeviceType,
      saveDeviceSettings: saveDeviceSettings
    };

    return service;

    function getSensorInfo(sensorId) {
      var options = {};
      var query = { 'tags' : ['Sensor:DeviceInfo','Sensor:CurrentValue'],
                    'match' : sensorId };
      options.prefix = sensorId.toUpperCase();

      return queryService.getMatchingSysvars( query, options );
    }

    function getModbusDevices(sensorId){
        var lastPollTS = '/' + sensorId.toUpperCase() + '/LAST_POLL_TS';
        var query = ['/BUS1/MBM/DEVS', lastPollTS, 'HMI/TEMPERATURE/UNIT'];

        return queryService.getSysvars(query).then(function(data) {
            data.isDead = deadDeviceService.getIsDead(sensorId, data);
            data.LAST_POLL_TS = data[sensorId.toUpperCase() + '_LAST_POLL_TS'];
            return data;
        });
    }

    function getSensorDetails(sensorId) {
      var sensorQuery = getSensorInfo( sensorId );
      var modbusQuery = getModbusDevices( sensorId );

      return $q.all({
        tag: sensorQuery,
        sysvar: modbusQuery,
      }).then(function(data) {
        data.LAST_POLL_TS = data.sysvar.LAST_POLL_TS;
        return data;
      },
      function (error) {
        $log.error(error);
        return $q.reject("Failed to retreive sensor with ID: " + sensorId);
      });
    }

    function setUnknownDeviceType(name, type) {
      var deviceInfo = deviceNameParserService.parseDeviceName(name);
      var requestObject = {};

      if (deviceInfo.bus === 'BUS1') {
        requestObject['/BUS1/UNKNOWN/DEV/ADDRESS'] = deviceInfo.address;
        requestObject['/BUS1/UNKNOWN/DEV/TYPE'] = type;
        requestObject['/BUS1/FORCE/DEVTYPE/APPLY'] = 1;
      }

      return queryService.setSysvars( requestObject, {
        order: ['/BUS1/UNKNOWN/DEV/ADDRESS', '/BUS1/UNKNOWN/DEV/TYPE', '/BUS1/FORCE/DEVTYPE/APPLY'] });

    }

    function saveDeviceSettings(sysvarName, selections) {
      var requestObject = {};

      requestObject[sysvarName + '/TYPE'] = "SensorBox";
      requestObject[sysvarName + '/SUBTYPE'] = createSubType(selections);
      return csbQuery.setFromObject(requestObject, true);
    }

    function createSubType(selections) {
      var values = [];

      if (selections.poa) {
        values.push('POA-I-Sensor');
      }

      if (selections.tmod) {
        values.push('Tmod-Sensor');
      }

      if (selections.tamb) {
        values.push('Tamb-Sensor');
      }

      if (selections.wind) {
        values.push('Wind-Sensor');
      }

      if (selections.ghi) {
        values.push('GH-I-Sensor');
      }

      return values.join();
    }
  }
]);
