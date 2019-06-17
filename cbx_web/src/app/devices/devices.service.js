"use strict";

angular.module('conext_gateway.devices').factory('deviceService',
  ['csbQuery', 'temperatureService',
  'unitFormatterService', '$q', '$filter', '$log',
  function (csbQuery, temperatureService,
    unitFormatterService, $q, $filter, $log) {
    var service = {
      getDevices       : getDevices,

      getInverters     : getInverters,
      getMeters        : getMeters,
      getSensors       : getSensors,

      getMeterUnits    : getMeterUnits,
      getInverterUnits : getInverterUnits,
    };

    // Return all the devices
    function getDevices() {
      return $q.all({
         inverters : getDataFor('Inverter'),
         meters    : getDataFor('Meter'),
         sensors   : getDataFor('Sensor'),
         // alarms    : activeAlarmsService.getAlarmsForOverview(),
      }).then(function (data) {
        return {
          inverters : processInverters(data.inverters, data.alarms),
          meters    : processMeters(data.meters, data.alarms),
          sensors   : processSensors(data.sensors, data.alarms),
        };
      },
      function (error) {
        $log.error(error);
        return $q.reject("Failed to return promise");
      });
    }

    function getInverters() {
      return getOneDeviceType('Inverter')
    }
    function getMeters() {
      return getOneDeviceType('Meter')
    }
    function getSensors() {
      return getOneDeviceType('Sensor')
    }

    function getOneDeviceType(deviceType) {
      return $q.all({
        device : getDataFor(deviceType),
        //alarms : activeAlarmsService.getAlarmsForOverview(),
      }).then(function(data) {
        var device;
        if (deviceType === 'Inverter') {
          return processInverters(data.device, data.alarms);
        }
        else if (deviceType === 'Meter') {
          return processMeters(data.device, data.alarms);
        }
        else if (deviceType === 'Sensor') {
          return processSensors(data.device, data.alarms);
        }
        return device;
      }).catch(function(error) {
        $log.error(error);
        return $q.reject();
      });
    }

    function getAddresses(device) {
      return parseInt(device.ID.split('-')[1]);
    }
    function sortOverviewQueryResult(data) {
      var sorted = $filter('orderBy')($filter('orderBy')(data, "ID", true), getAddresses);
      return $q.resolve(sorted);
    }

    function getDataFor(deviceType) {
      var queryString = 'deviceType=' + deviceType;
      return csbQuery
        .getObjFromScript(queryString, '/SB/getDeviceOverviewItems')
        .then(sortOverviewQueryResult);
    }

    function processInverters(inverters, alarms) {
      // Join the software builds together into one string
      inverters.forEach(function (inverter) {
        var isBuildDefined = function (build) {
          return build !== undefined && build !== null && build !== ""
        };
        inverter.SoftwareBuild =
          [inverter.SoftwareBuildA, inverter.SoftwareBuildB, inverter.SoftwareBuildC]
          .filter(isBuildDefined)
          .join(",");
          inverter.modbus = true;
          inverter.icon = 'GT';
      });

      addAlarmsToDevices(inverters, alarms);
      return inverters;
    }

    function processSensors(sensors, alarms) {
      sensors.forEach(function(sensor) {
        // Back-end query *does* convert the units for us,
        // but *does not* convert the value. Value is always
        // in degrees C.
        if (sensor.Unit === 'C' || sensor.Unit === 'F') {
          sensor.Value = temperatureService.convert(sensor.Unit, sensor.Value);

          // Call getUnitsString even if sensor.Unit is Celsius, because
          // this will convert 'C' to '°C', which looks better in the UI.
          sensor.Unit = temperatureService.getUnitsString(sensor.Unit);
        }
        sensor.modbus = true;
        sensor.icon = 'sensor';
      });

      addAlarmsToDevices(sensors, alarms);
      return sensors;
    }

    function processMeters(meters, alarms) {
      meters.forEach(function(meter) {
        meter.modbus = true;
        meter.icon = 'meter';
      });

      addAlarmsToDevices(meters, alarms);
      return meters;
    }

    function addAlarmsToDevices(devices, alarms) {
      devices.forEach(function(device) {
        var sysvarName = device.deviceSysvarName.toUpperCase();
        if (alarms.hasOwnProperty(sysvarName)) {
          device.hasAlarms   = alarms[sysvarName].alarms;
          device.hasWarnings = alarms[sysvarName].warnings;
        }
        else {
          device.hasAlarms   = false;
          device.hasWarnings = false;
        }
      });

    }

    function getInverterUnits(inverters) {
      var columns = ['ACEnergyLifetime', 'ACEnergyToday', 'RealPower'];
      return unitFormatterService.findGreatestUnit(columns, inverters);
    }

    function getMeterUnits(meters) {
      var columns = ['RealPower', 'NetRealEnergyToday', 'NetRealEnergyLifetime'];
      return unitFormatterService.findGreatestUnit(columns, meters);
    }


    return service;
  }
]);
