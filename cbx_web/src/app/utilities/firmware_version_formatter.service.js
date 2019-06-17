"use strict";

angular.module('conext_gateway.utilities').factory('firmwareVersionFormatter', [function() {
  return {
    formatVersion: formatVersion,
  };
}]);

angular.module('conext_gateway.utilities').filter('firmwareVersionFormatter', [function() {
  return function(value) {
    return formatVersion(value);
  }
}]);


function formatVersion(version) {
  var result = "";
  if(version !== undefined && version !== "") {
    var version_string = version.toString();
    var xx = version_string.slice(0, -4);
    var yyzz = version_string.slice(-4);
    var zz = yyzz.slice(-2)
    var yy = yyzz.slice(0, -2);
    result = xx + '.' + yy + '.' + zz;
  }
  return result;
}
