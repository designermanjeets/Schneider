"use strict";

angular.module('conext_gateway.devices').factory('inverterDetailsService',
  ['queryService', 'deviceObjectFormatterService', 'deadDeviceService',
  '$q', '$log',
  function ( queryService, deviceObjectFormatterService, deadDeviceService,
    $q, $log) {
    var service = {
      getInverterDetails: getInverterDetails,
    };

    return service;

    function getInverterInfo(inverterId) {
      var options = {};
      var query = {'tags' : ['Inverter:DeviceInfo','Inverter:CurrentValue'],
                     'match' : inverterId };
      options.prefix = inverterId.toUpperCase();

      return queryService.getMatchingSysvars( query, options );
    }

    function getModbusDevices(inverterId){
        var lastPollTS = '/' + inverterId.toUpperCase() + '/LAST_POLL_TS';
        var query = ['/BUS1/MBM/DEVS','HMI/TEMPERATURE/UNIT', lastPollTS];

        return queryService.getSysvars(query).then(function(data) {
            data.isDead = deadDeviceService.getIsDead(inverterId, data);
            data.LAST_POLL_TS = data[inverterId.toUpperCase() + '_LAST_POLL_TS'];
            return data;
        });
    }

    function getInverterDetails(inverterId) {
      var inverterQuery = getInverterInfo( inverterId );
      var modbusQuery = getModbusDevices( inverterId );

      return $q.all({
        tag: inverterQuery,
        sysvar: modbusQuery,
      }).then(function(data) {
        data.HMI_TEMPERATURE_UNIT = data.sysvar.HMI_TEMPERATURE_UNIT;
        data.LAST_POLL_TS = data.sysvar.LAST_POLL_TS;
        return data;
      },
      function (error) {
        $log.error(error);
        return $q.reject("Failed to retreive inverter with ID: " + inverterId);
      });
    }
  }
]);
