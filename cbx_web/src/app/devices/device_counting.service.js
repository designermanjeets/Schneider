"use strict";

angular.module('SchneiderAppServices',
  ['csbQueryModule']);

angular.module('SchneiderAppServices').factory('deviceCountingService', ['$filter',
  function ($filter) {
    var service = {
      getDeviceCount: getDeviceCount
    };

    return service;

    function getDeviceCount(devices, busAddressRange, deviceRange, port) {
      var busCount = {
        inverterCount: 0,
        meterCount: 0,
        sensorCount: 0,
        unknownInvertersCount: 0,
        unknownMetersCount: 0,
        unknownSensorsCount: 0,
        unknownDeviceCount: 0,
        unknownDevices: [],
        knownDevices: [],
        totalCount: 0
      }

      for (var i = 0; i < devices.length; i++) {
        if (busAddressRange.start <= devices[i].address && busAddressRange.end >= devices[i].address && devices[i].isDead !== 'Yes') {
          if (devices[i].type.toUpperCase() === "CONEXTCL" || devices[i].type.toUpperCase() === "CL60") {
            busCount.knownDevices.push({
              "port": port,
              "address": devices[i].address,
              "type": devices[i].type
            });
            busCount.inverterCount++;
          } else if (devices[i].type.toUpperCase() === "EM3555" || devices[i].type.toUpperCase() === "PME51C2" || devices[i].type.toUpperCase() === "PM2XXX") {
            busCount.knownDevices.push({
              "port": port,
              "address": devices[i].address,
              "type": devices[i].type
            });
            busCount.meterCount++;
          } else if (devices[i].type.toUpperCase() === "PVMET200" || devices[i].type.toUpperCase() === "IMTSOLAR") {
            busCount.knownDevices.push({
              "port": port,
              "address": devices[i].address,
              "type": devices[i].type
            });
            busCount.sensorCount++;
          } else if (deviceRange.INVERTER_START <= devices[i].address && deviceRange.INVERTER_END >= devices[i].address) {
            busCount.unknownDevices.push({
              "port": port,
              "address": devices[i].address,
              "type": "Inverter",
              "errorMessage": $filter('translate')('devices.counting_service.unknown_device', {'device': devices[i].address, 'port': port})
            });
            busCount.unknownInvertersCount++;
          } else if (deviceRange.METER_START <= devices[i].address && deviceRange.METER_END >= devices[i].address) {
            busCount.unknownDevices.push({
              "port": port,
              "address": devices[i].address,
              "type": "Meter",
              "errorMessage": $filter('translate')('devices.counting_service.unknown_device', { 'device': devices[i].address, 'port': port })
            });
            busCount.unknownMetersCount++;
          } else if (deviceRange.SENSOR_START <= devices[i].address && deviceRange.SENSOR_END >= devices[i].address) {
            busCount.unknownDevices.push({
              "port": port,
              "address": devices[i].address,
              "type": "Sensor",
              "errorMessage": $filter('translate')('devices.counting_service.unknown_device', { 'device': devices[i].address, 'port': port })
            });
            busCount.unknownSensorsCount++;
          } else {
            busCount.unknownDevices.push({
              "port": port,
              "address": devices[i].address,
              "type": "Unknown",
              "errorMessage": $filter('translate')('devices.counting_service.unknown_device', { 'device': devices[i].address, 'port': port })
            });
            busCount.unknownDeviceCount++;
          }
        }
      }

      busCount.totalCount = busCount.inverterCount + busCount.meterCount + busCount.sensorCount +
        busCount.unknownInvertersCount + busCount.unknownMetersCount + busCount.unknownSensorsCount + busCount.unknownDeviceCount;

      return busCount;
    }
  }
]);
