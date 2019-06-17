"use strict";

angular.module('conext_gateway.devices').factory('detectionValidationService', [
  function () {
    var service = {
      validateRangeDefinition: validateRangeDefinition,
      validateDeviceDetection: validateDeviceDetection,
    };

    return service;

    ///////////////////////////////////////
    // For range definition
    function validateRangeDefinition(rangeDefinitions, form) {
      ['A'].forEach(function (port) {

        form['inverterStartPort' + port].$setValidity('startEnd',
          validateStartEnd(rangeDefinitions, port, 'INVERTER'));
        form['inverterStartPort' + port].$setValidity('inverterMeterOverlap',
          validateOverlap(rangeDefinitions, port, 'INVERTER', 'METER'));
        form['inverterStartPort' + port].$setValidity('inverterSensorOverlap',
          validateOverlap(rangeDefinitions, port, 'INVERTER', 'SENSOR'));

        form['meterStartPort' + port].$setValidity('startEnd',
          validateStartEnd(rangeDefinitions, port, 'METER'));
        form['meterStartPort' + port].$setValidity('meterSensorOverlap',
          validateOverlap(rangeDefinitions, port, 'METER', 'SENSOR'));

        form['sensorStartPort' + port].$setValidity('startEnd',
          validateStartEnd(rangeDefinitions, port, 'SENSOR'));
      });
    }

    function validateStartEnd(rangeDefinitions, port, device) {
      var start = rangeDefinitions[device + '_START_PORT' + port];
      var end = rangeDefinitions[device + '_END_PORT' + port];

      // If one of the values is missing, show the 'required' error instead.
      var suppressError = !angular.isNumber(start) || !angular.isNumber(end);

      return start <= end || suppressError;
    }

    // Do the ranges of 2 devices overlap? Return true if values are OK
    function validateOverlap(rangeDefinitions, port, device1, device2) {
      // This doesn't seem to return false if one of the values is null,
      // so we don't need to explicitly suppress the errors like we do
      // with validateStartEnd()

      //Check if device2.start is between device1.start and device1.end
      if (rangeDefinitions[device2 + '_START_PORT' + port] >= rangeDefinitions[device1 + '_START_PORT' + port]
        && rangeDefinitions[device2 + '_START_PORT' + port] <= rangeDefinitions[device1 + '_END_PORT' + port]) {
        return false;
      }

      //Check if device2.end is between device1.start and device1.end
      if (rangeDefinitions[device2 + '_END_PORT' + port] >= rangeDefinitions[device1 + '_START_PORT' + port]
        && rangeDefinitions[device2 + '_END_PORT' + port] <= rangeDefinitions[device1 + '_END_PORT' + port]) {
        return false;
      }

      //Check if device1.start is between device2.start and device2.end
      if (rangeDefinitions[device1 + '_START_PORT' + port] >= rangeDefinitions[device2 + '_START_PORT' + port]
        && rangeDefinitions[device1 + '_START_PORT' + port] <= rangeDefinitions[device2 + '_END_PORT' + port]) {
        return false;
      }

      //Check if device1.end is between device2.start and device2.end
      if (rangeDefinitions[device1 + '_END_PORT' + port] >= rangeDefinitions[device2 + '_START_PORT' + port]
        && rangeDefinitions[device1 + '_END_PORT' + port] <= rangeDefinitions[device2 + '_END_PORT' + port]) {
        return false;
      }

      return true;



    }

    ///////////////////////////////////////
    // For device detection
    function validateDeviceDetection(detectionRanges, form) {
      // Ensure that both parameters are given for a port
      var hasPortAStart = !isNaN(parseInt(detectionRanges.BUS1_AUTODETECT_ADDR_START));
      var hasPortAEnd = !isNaN(parseInt(detectionRanges.BUS1_AUTODETECT_ADDR_END));
      var hasPortBStart = !isNaN(parseInt(detectionRanges.BUS2_AUTODETECT_ADDR_START));
      var hasPortBEnd = !isNaN(parseInt(detectionRanges.BUS2_AUTODETECT_ADDR_END));
      form.portAStart.$setValidity('bothValues', hasPortAStart || !hasPortAEnd);
      form.portAEnd.$setValidity('bothValues', !hasPortAStart || hasPortAEnd);
      form.portBStart.$setValidity('bothValues', hasPortBStart || !hasPortBEnd);
      form.portBEnd.$setValidity('bothValues', !hasPortBStart || hasPortBEnd);

      // Ensure that the user didn't submit a form with no values whatsoever
      form.dummyField.$setValidity('enterSomething', hasPortAStart || hasPortAEnd || hasPortBStart || hasPortBEnd);

      // Ensure that start <= end
      var portAStartEnd = detectionRanges.BUS1_AUTODETECT_ADDR_START < detectionRanges.BUS1_AUTODETECT_ADDR_END;
      var portBStartEnd = detectionRanges.BUS2_AUTODETECT_ADDR_START < detectionRanges.BUS2_AUTODETECT_ADDR_END;

      // Only show this error if both values are present. If one of them is missing, hide this error
      // because the bothValues error takes precidence.
      var hasPortA = hasPortAStart && hasPortAEnd;
      var hasPortB = hasPortBStart && hasPortBEnd;

      form.portAStart.$setValidity('startEnd', portAStartEnd || !hasPortA);
      form.portAEnd.$setValidity('startEnd', portAStartEnd || !hasPortA);
      form.portBStart.$setValidity('startEnd', portBStartEnd || !hasPortB);
      form.portBEnd.$setValidity('startEnd', portBStartEnd || !hasPortB);
    }
  }
]);
