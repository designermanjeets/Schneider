"use strict";

angular.module('conext_gateway.devices').factory('deadDeviceService',
  ['$log',
  function ($log) {
    var UNKNOWN_DEVICE_ID = "--";

    return {
      getIsDead: getIsDead,
      _getBusFromDeviceId: getBusFromDeviceId,
      _getAddressFromDeviceId: getAddressFromDeviceId,
    };

    function getBusFromDeviceId(deviceId) {
      if (deviceId === UNKNOWN_DEVICE_ID) {
        return null;
      }

      var bus_re = /^BUS(\d+)/;

      var found = deviceId.split(' ').join('').match(bus_re);
      if (found === null) {
        $log.error("Unable to find bus ID from device ID: " + deviceId);
        return null;
      }

      var bus = found[1];
      if (bus.length !== 1) {
        $log.error("Bus has bad format: " + deviceId);
        return null;
      }
      if (bus <= 0 || bus > 2) {
        $log.error("Bus out of range. Device ID: " + deviceId);
        return null;
      }

      return Number(bus, 10);
    }

    function getAddressFromDeviceId(deviceId) {
      if (deviceId === UNKNOWN_DEVICE_ID) {
        return null;
      }

      var address_re = /(\d+)$/;

      var found = deviceId.split(' ').join('').match(address_re);

      if (found === null) {
        $log.error("Unable to find address from device ID: " + deviceId);
        return null;
      }

      var deviceAddress = found[1];
      if (deviceAddress <= 0 || deviceAddress > 247) {
        $log.error("Device address out of range. Device ID: " + deviceId);
        return null;
      }
      return Number(deviceAddress, 10);
    }

    // This is a temporary band-aid to suppress the display of values that are coming
    // from a dead device. Eventually, we'll want to get this from the quality bits.
    // But the quality bits aren't ready yet.
    function getIsDead(deviceId, mbmDev) {
      var bus = getBusFromDeviceId(deviceId);
      var address = getAddressFromDeviceId(deviceId);

      if (bus === null) {
        return;
      }
      var deviceList = (bus === 1) ? mbmDev.BUS1_MBM_DEVS : mbmDev.BUS2_MBM_DEVS;
      for (var idx = 0; idx < deviceList.length; idx++) {
        if (deviceList[idx].address === address) {
          var isDead = deviceList[idx].isDead.toUpperCase().split(' ').join('');
          switch (isDead) {
            case 'YES':
              return true;

            case 'NO':
            // n/a means unknown device. We won't be showing readouts for
            // the device anyways, so it doesn't matter.
            case 'N/A':
              return false;

            default:
              $log.error("Bad value for isDead: " + isDead);
              return false;
          }
        }
      }

      $log.error("Didn't find what I was looking for: " + deviceId);
      return false;
    }
  }
]);
