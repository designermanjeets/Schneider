"use strict";

angular.module('conext_gateway.utilities').factory('intervalManagerService', ['$interval', 'connectionCheckService',
  function ($interval, connectionCheckService) {
    var intervals = {};
    var intervalHandler;
    var intervalTime = 60000;

    intervals.length = function () {
      var count = 0;
      angular.forEach(intervals, function (value, key) {
        if (key !== 'length') {
          count++;
        }
      });
      return count;
    }

    var service = {
      register: register,
      deRegister: deRegister,
      getIntervals: getIntervals,
      setIntervalTime: setIntervalTime,
      isRunning: isRunning
    }

    return service;

    function isRunning() {
      return intervalHandler ? true : false;
    }

    function setIntervalTime(time) {
      intervalTime = time;
    }

    function getIntervals() {
      return intervals;
    }
    //starts the interval
    function startInterval() {
      if (!intervalHandler) {
        intervalHandler = $interval(function () {
          angular.forEach(intervals, function (value, key) {
            if (!connectionCheckService.isConnectionLost() && key !== 'length') {
              value.callback();
            }
          });
        }, intervalTime);
      }
    }



    //cancels the interval and clears the handler
    function stopInterval() {
      if (intervalHandler) {
        $interval.cancel(intervalHandler);
        intervalHandler = undefined;
      }
    }

    //registers intervals, registers a destroy menthod on the scope
    //and starts the interval if it was not started.
    function register(callback, identifier, scope) {
      if(angular.isFunction(callback) && angular.isString(identifier) && scope.$on)
      if (intervals[identifier]) {
        delete intervals[identifier];
      }

      intervals[identifier] = {};
      intervals[identifier].callback = callback;
      intervals[identifier].scope = scope;


      var dereg = scope.$on("$destroy", function () {
        deRegister(identifier);
      });
      intervals[identifier].dereg = dereg;

      if (!intervalHandler) {
        startInterval();
      }
    }

    //deregister intervals and stops the interval if there are no items
    function deRegister(identifier) {
      if (intervals[identifier]) {
        intervals[identifier].dereg();
        delete intervals[identifier];
      }

      if (intervals.length() === 0) {
        stopInterval();
      }
    }

  }
]);
