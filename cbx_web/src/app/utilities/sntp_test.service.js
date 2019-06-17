"use strict";

angular.module('conext_gateway.utilities').factory('sntpTestService', [
  'csbQuery', '$interval',
  function (csbQuery, $interval) {
    var service = {
      testSNTP: testSNTP
    };

    function testSNTP($scope, callback) {
      var handler;
      handler = $interval(function () {
        csbQuery.getObj("SNTP.TEST_REPLY").then(function (data) {
          if (data.SNTP_TEST_REPLY === 'eFail') {
            $interval.cancel(handler);
            callback('Fail');
          }
          else if (data.SNTP_TEST_REPLY === 'eSuccess') {
            $interval.cancel(handler);
            callback('Success');
          }
        },
        function (error) {
          callback("Fail");
        });
      }, 5000);

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
