"use strict";

angular.module('conext_gateway.events').filter('getTime', [function () {
  return function(input) {
    // do some bounds checking here to ensure it has that index
    return input.split(' ')[1];
  }
}]);


angular.module('conext_gateway.events').filter('getDate', [function () {
  return function (input) {
    // do some bounds checking here to ensure it has that index
    return input.split(' ')[0];
  }
}]);
