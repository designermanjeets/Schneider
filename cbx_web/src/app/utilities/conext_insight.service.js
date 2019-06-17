"use strict";

angular.module('conext_gateway.utilities').factory('conextInsightService', [
  'csbQuery', '$interval',
  function (csbQuery, $interval) {
    var handler;
    var service = {
      testConnection: testConnection
    };

    function testConnection(callback, $scope) {

      csbQuery.setFromObject({
        "WEBPORTAL.TEST_REPLY": "eNotStarted",
        "WEBPORTAL.TEST_REQUEST": 1
      }).then(function() {
        handler = $interval(function () {
          csbQuery.getObj("WEBPORTAL.TEST_REPLY").then(function (data) {
            if (data.WEBPORTAL_TEST_REPLY === 'eFail') {
              $interval.cancel(handler);
              callback('Fail');
            }
            else if (data.WEBPORTAL_TEST_REPLY === 'eSuccess') {
              $interval.cancel(handler);
              callback('Success');
            }
          },
          function(error) {
            callback("Fail");
          });
        }, 5000);
      });

      var dereg = $scope.$on("$destroy", function () {
        if (handler) {
          $interval.cancel(handler);
          handler = null;
          dereg();
        }
      });
    }

    return service;
  }
]);
