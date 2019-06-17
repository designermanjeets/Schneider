"use strict";

angular.module('conext_gateway.devices').factory('meterDetailsService',
  ['queryService', 'csbQuery', 'deviceObjectFormatterService', 'deadDeviceService',
  '$q', '$log',
  function ( queryService, csbQuery, deviceObjectFormatterService, deadDeviceService, $q, $log) {
    var service = {
      getMeterDetails: getMeterDetails,
      setMeterType: setMeterType
    };

    return service;

    function getMeterInfo(meterId) {
      var options = {};
      var query = {'tags' : ['Meter:DeviceInfo','Meter:CurrentValue', 'Meter:Setting'],
                     'match' : meterId };
      options.prefix = meterId.toUpperCase();

      return queryService.getMatchingSysvars( query, options );
    }

    function getModbusDevices(meterId){
        var lastPollTS = '/' + meterId.toUpperCase() + '/LAST_POLL_TS';
        var query = ['/BUS1/MBM/DEVS', lastPollTS];

        return queryService.getSysvars(query).then(function(data) {
            data.isDead = deadDeviceService.getIsDead(meterId, data);
            data.LAST_POLL_TS = data[meterId.toUpperCase() + '_LAST_POLL_TS'];
            return data;
        });
    }

    function getMeterDetails(meterId) {
      var meterQuery = getMeterInfo( meterId );
      var modbusQuery = getModbusDevices( meterId );

      return $q.all({
        tag: meterQuery,
        sysvar: modbusQuery,
      }).then(function(data) {
        data.LAST_POLL_TS = data.sysvar.LAST_POLL_TS;
        return data;
      },
      function (error) {
        $log.error(error);
        return $q.reject("Failed to retreive meter with ID: " + meterId);
      });
    }

    function setMeterType(meterId, meterType) {
      return csbQuery.getObjFromScript("meterName=" + meterId + "&meterType=" + meterType, '/SB/setMeterType');
    }
  }
]);
