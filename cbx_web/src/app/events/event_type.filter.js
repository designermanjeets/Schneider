"use strict";

angular.module('conext_gateway.events').filter('eventType', ['$filter', function ($filter) {

  return function (type) {
    var result = "";
    switch (type) {
      case "Meter":
        result = 'events.meter';
        break;
      case "Inverter":
        result = 'events.inverter';
        break;
      case "Sensor":
        result = 'events.sensor';
        break;
      case "System":
        result = 'events.system';
        break;
      default:
        break;
    }

    return $filter('translate')(result);
  }
}]);
