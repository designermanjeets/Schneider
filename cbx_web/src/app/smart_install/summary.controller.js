/* eslint angular/angularelement:0, angular/no-services:0 */
"use strict";

angular.module('conext_gateway.smart_install').controller('smartInstallSummaryController',
  ["$scope", "$http", "csbQuery", "$window", "$state", "$translate",
  function ($scope, $http, csbQuery, $window, $state, $translate) {
    var idType = "#";

    var stringIds = [
      'smart_install.summary.success',
      'smart_install.summary.failed',
      'smart_install.summary.skipped',
      'smart_install.summary.nodevices'
    ];

    $translate(stringIds).then(function (stringForId) {
      var success = stringForId['smart_install.summary.success'];
      var failed = stringForId['smart_install.summary.failed'];
      var skipped = stringForId['smart_install.summary.skipped'];
      var nodevices = stringForId['smart_install.summary.nodevices'];

      angular.forEach(["Step2StatusApp", "Step3StatusApp", "Step4StatusApp", "Step5StatusApp"], function (value, index) {
        var status = $window.sessionStorage.getItem(value);
        if (status === "skipped") {
          $(idType.concat(value)).html(skipped).addClass('skippedClass');
        } else if (status === "success") {
          $(idType.concat(value)).html(success).addClass('successClass');
        } else if (status === "nodevices") {
          $(idType.concat(value)).html(nodevices).addClass('skippedClass');
        } else { // failed status
          $(idType.concat(value)).html(failed).addClass('failedClass');
        }
      });
    });

    $scope.nextClicked = function () {
      csbQuery.setFromObject({ "SMARTINSTALL/STATUS": 1 }, true);
      // TODO: error checking when set response with error

      $window.sessionStorage.setItem("SkipStep1App", null);
      $window.sessionStorage.setItem("Step2StatusApp", null);
      $window.sessionStorage.setItem("Step3StatusApp", null);
      $window.sessionStorage.setItem("Step4StatusApp", null);
      $window.sessionStorage.setItem("Step5StatusApp", null);
      //$window.location.href = '/index.html';

      $state.go('dashboard');
    };
  }]);
