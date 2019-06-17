"use strict";

angular.module('conext_gateway.devices').factory('detectionService', ['csbQuery', 'deviceCountingService', '$log', '$q',
function (csbQuery, deviceCountingService, $log, $q) {

  var deviceRangeQuery = 'INVERTER/START/PORTA,INVERTER/END/PORTA,METER/START/PORTA,METER/END/PORTA,SENSOR/START/PORTA,SENSOR/END/PORTA';
  deviceRangeQuery += ',INVERTER/START/PORTB,INVERTER/END/PORTB,METER/START/PORTB,METER/END/PORTB,SENSOR/START/PORTB,SENSOR/END/PORTB';
  var service = {
    getDeviceRangeDefinitions: getDeviceRangeDefinitions,
    setDeviceRangeDefinitions: setDeviceRangeDefinitions,
    startDeviceDetection: startDeviceDetection,
    stopDeviceDetection: stopDeviceDetection,
    getDetectionProgress: getDetectionProgress,
    getTotalDeviceCount: getTotalDeviceCount
  };

  return service;

  function getDeviceRangeDefinitions() {
    return csbQuery.getObj(deviceRangeQuery);
  }

  function setDeviceRangeDefinitions(ranges) {
    var requestObject = {};
    requestObject['INVERTER/START/PORTA'] = ranges.INVERTER_START_PORTA;
    requestObject['INVERTER/END/PORTA'] = ranges.INVERTER_END_PORTA;
    requestObject['METER/START/PORTA'] = ranges.METER_START_PORTA;
    requestObject['METER/END/PORTA'] = ranges.METER_END_PORTA;
    requestObject['SENSOR/START/PORTA'] = ranges.SENSOR_START_PORTA;
    requestObject['SENSOR/END/PORTA'] = ranges.SENSOR_END_PORTA;

    requestObject['INVERTER/START/PORTB'] = ranges.INVERTER_START_PORTB;
    requestObject['INVERTER/END/PORTB'] = ranges.INVERTER_END_PORTB;
    requestObject['METER/START/PORTB'] = ranges.METER_START_PORTB;
    requestObject['METER/END/PORTB'] = ranges.METER_END_PORTB;
    requestObject['SENSOR/START/PORTB'] = ranges.SENSOR_START_PORTB;
    requestObject['SENSOR/END/PORTB'] = ranges.SENSOR_END_PORTB;
    return csbQuery.setFromObject(requestObject, true);
  }

  function startDeviceDetection(detectionRanges) {
    var requestObject = {};
    var ordering = [];

    if (detectionRanges.BUS1_AUTODETECT_ADDR_START != null && detectionRanges.BUS1_AUTODETECT_ADDR_END != null) {
      requestObject["/BUS1/AUTODETECT/ADDR/START"] = detectionRanges.BUS1_AUTODETECT_ADDR_START;
      requestObject["/BUS1/AUTODETECT/ADDR/END"] = detectionRanges.BUS1_AUTODETECT_ADDR_END;
      requestObject["/BUS1/START/AUTODETECT"] = 1;

      ordering.push("/BUS1/AUTODETECT/ADDR/START");
      ordering.push("/BUS1/AUTODETECT/ADDR/END");
      ordering.push("/BUS1/START/AUTODETECT");
    }

    if (detectionRanges.BUS2_AUTODETECT_ADDR_START != null && detectionRanges.BUS2_AUTODETECT_ADDR_END != null) {
      requestObject["/BUS2/AUTODETECT/ADDR/START"] = detectionRanges.BUS2_AUTODETECT_ADDR_START;
      requestObject["/BUS2/AUTODETECT/ADDR/END"] = detectionRanges.BUS2_AUTODETECT_ADDR_END;
      requestObject["/BUS2/START/AUTODETECT"] = 1;

      ordering.push("/BUS2/AUTODETECT/ADDR/START");
      ordering.push("/BUS2/AUTODETECT/ADDR/END");
      ordering.push("/BUS2/START/AUTODETECT");
    }

    return csbQuery.setFromObject(requestObject, false, ordering);
  }

  function getDetectionProgress(detectionRanges) {
    var query = "";
    if (detectionRanges.BUS1_AUTODETECT_ADDR_START != null && detectionRanges.BUS1_AUTODETECT_ADDR_END != null) {
      query += "/BUS1/AUTODETECT/PROGRESS";
    }

    if (detectionRanges.BUS2_AUTODETECT_ADDR_START != null && detectionRanges.BUS2_AUTODETECT_ADDR_END != null) {
      if (detectionRanges.BUS1_AUTODETECT_ADDR_START != null && detectionRanges.BUS1_AUTODETECT_ADDR_END != null) {
        query += ",";
      }
      query += "/BUS2/AUTODETECT/PROGRESS";
    }

    return csbQuery.getObj(query)
      .then(function (data) {
        if (detectionRanges.BUS2_AUTODETECT_ADDR_START != null && detectionRanges.BUS2_AUTODETECT_ADDR_END != null &&
          detectionRanges.BUS1_AUTODETECT_ADDR_START != null && detectionRanges.BUS1_AUTODETECT_ADDR_END != null) {
          return parseInt((getAsPercent(data.BUS1_AUTODETECT_PROGRESS, detectionRanges.BUS1_AUTODETECT_ADDR_START, detectionRanges.BUS1_AUTODETECT_ADDR_END) +
          getAsPercent(data.BUS2_AUTODETECT_PROGRESS, detectionRanges.BUS2_AUTODETECT_ADDR_START, detectionRanges.BUS2_AUTODETECT_ADDR_END)) / 2);
        }
        if (detectionRanges.BUS1_AUTODETECT_ADDR_START != null && detectionRanges.BUS1_AUTODETECT_ADDR_END != null) {
          return parseInt(getAsPercent(data.BUS1_AUTODETECT_PROGRESS, detectionRanges.BUS1_AUTODETECT_ADDR_START, detectionRanges.BUS1_AUTODETECT_ADDR_END));
        }
        return parseInt(getAsPercent(data.BUS2_AUTODETECT_PROGRESS, detectionRanges.BUS2_AUTODETECT_ADDR_START, detectionRanges.BUS2_AUTODETECT_ADDR_END));
      },
      function (error) {
        $log.error(error);
        return $q.reject("Failed to retreive detection progress");
      });
  }

  function getAsPercent(progress, start, end) {
    var progressPercent = (parseInt(progress) - parseInt(start)) / (parseInt(end) - parseInt(start)) * 100;
    return (progressPercent < 0) ? 0 : progressPercent;
  }

  function getTotalDeviceCount(addressRange) {
    var query = "/BUS1/MBM/DEVS,/BUS2/MBM/DEVS," + deviceRangeQuery + ",/BUS1/AUTODETECT/PROGRESS,/BUS2/AUTODETECT/PROGRESS";
    return csbQuery.getObj(query).then(function (data) {

      var countHolder = {};
      var deviceRanges = createDeviceRangeObject(data);
      var addressRanges = createAddressRangeObject(addressRange, data);

      if (addressRange.BUS1_AUTODETECT_ADDR_START != null && addressRange.BUS1_AUTODETECT_ADDR_END != null) {
        countHolder.bus1Count = deviceCountingService.getDeviceCount(data.BUS1_MBM_DEVS, addressRanges.bus1Range, deviceRanges.portA, 'A');
      }
      if (addressRange.BUS2_AUTODETECT_ADDR_START != null && addressRange.BUS2_AUTODETECT_ADDR_END != null) {
        countHolder.bus2Count = deviceCountingService.getDeviceCount(data.BUS2_MBM_DEVS, addressRanges.bus2Range, deviceRanges.portB, 'B');
      }

      if (addressRange.BUS2_AUTODETECT_ADDR_START != null && addressRange.BUS2_AUTODETECT_ADDR_END != null &&
        addressRange.BUS1_AUTODETECT_ADDR_START != null && addressRange.BUS1_AUTODETECT_ADDR_END != null) {
        countHolder.unknownDevices = countHolder.bus1Count.unknownDevices.concat(countHolder.bus2Count.unknownDevices);
      }
      else if (addressRange.BUS1_AUTODETECT_ADDR_START != null && addressRange.BUS1_AUTODETECT_ADDR_END != null) {
        countHolder.unknownDevices = countHolder.bus1Count.unknownDevices;
      } else {
        countHolder.unknownDevices = countHolder.bus2Count.unknownDevices;
      }

      return countHolder;
    },
    function (error) {
      $log.error(error);
      return $q.reject("Failed to get devices");
    });
  }

  function stopDeviceDetection(detectionRanges) {
    var requestObject = {};

    if (detectionRanges.BUS1_AUTODETECT_ADDR_START !== null && detectionRanges.BUS1_AUTODETECT_ADDR_END !== null) {
      requestObject["/BUS1/AUTODETECT/STOP"] = 1;
    }

    if (detectionRanges.BUS2_AUTODETECT_ADDR_START !== null && detectionRanges.BUS2_AUTODETECT_ADDR_END !== null) {
      requestObject["/BUS2/AUTODETECT/STOP"] = 1;
    }

    return csbQuery.setFromObject(requestObject);
  }

  function createAddressRangeObject(addressRange, data) {
    return {
      bus1Range: {
        start: addressRange.BUS1_AUTODETECT_ADDR_START,
        end: data.BUS1_AUTODETECT_PROGRESS
      },
      bus2Range: {
        start: addressRange.BUS2_AUTODETECT_ADDR_START,
        end: data.BUS2_AUTODETECT_PROGRESS
      }
    };
  }
  function createDeviceRangeObject(data) {
    return {
      portA: {
        INVERTER_START: data.INVERTER_START_PORTA,
        INVERTER_END: data.INVERTER_END_PORTA,
        METER_START: data.METER_START_PORTA,
        METER_END: data.METER_END_PORTA,
        SENSOR_START: data.SENSOR_START_PORTA,
        SENSOR_END: data.SENSOR_END_PORTA
      }
    };
  }

}
]);
