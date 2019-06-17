
"use strict";

angular.module('conext_gateway.events').filter('getLongFaultDescription', ['$filter', function ($filter) {

  return function (alarm) {
    var deviceType = alarm.deviceType;
    if (alarm.deviceId.indexOf('PM2') > -1) {
      deviceType = 'PM2XXX';
    }

    if (alarm.deviceId.indexOf('CL60') > -1) {
      deviceType = 'CL60';
    }

    var key = 'events.error_code.' + deviceType + '.' + alarm.eventCode + '.long_desc';
    return alarm.eventCode + ' - ' + $filter('translate')(key);
  }
}]);


angular.module('conext_gateway.events').filter('getShortFaultDescription', ['$filter', function ($filter) {
  return function (alarm) {
    var deviceType = alarm.deviceType;

    if (deviceType !== 'System') {
      if (alarm.deviceId.indexOf('PM2') > -1) {
        deviceType = 'PM2XXX';
      }

      if (alarm.deviceId.indexOf('CL60') > -1) {
        deviceType = 'CL60';
      }
    }

    var key = 'events.error_code.' + deviceType + '.' + alarm.eventCode + '.short_desc';
    return alarm.eventCode + ' - ' + $filter('translate')(key);
  }
}]);
