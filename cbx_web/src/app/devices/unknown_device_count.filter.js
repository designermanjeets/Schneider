
"use strict";

angular.module('conext_gateway.devices').filter('consolidateUnknownDevices', ['NDASH', function (NDASH) {
  return function (deviceCount) {
    if (deviceCount.unknownInvertersCount == null || deviceCount.unknownMetersCount == null || deviceCount.unknownSensorsCount == null || deviceCount.unknownDeviceCount == null) {
      return NDASH;
    }
    return deviceCount.unknownInvertersCount + deviceCount.unknownMetersCount + deviceCount.unknownSensorsCount + deviceCount.unknownDeviceCount;
  }
}]);
