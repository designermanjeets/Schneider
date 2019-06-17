/**
 *
 * @copyright (c) 2015 Schneider Electric. All Rights Reserved.
 *   All trademarks are owned by  Schneider Electric Industries SAS or its affiliated companies.
 *
 * @fileOverview
 *
 * @description  This is the controller for the disclaimer HTML page.
 *
 * @version 0.1 Dec 21, 2015     Eddie Leung
 *   created
 *
*/

// Turn of linting, because this is old code ported from Linux and we don't have
// capacity to bring it up to standards.
/* eslint no-redeclare:0, angular/di: 0, angular/angularelement: 0, eqeqeq: 0 */

/** Execute in strict mode */
"use strict";

var AUTHENTICATON_ERROR = 403;

/* Module dependency definitions */
angular
    .module("conext_gateway.disclaimer")
    .controller("disclaimerModalController", ["$scope", "$uibModalInstance", "csbQuery", "userName", "$window", "$log", "redirectService",
    function ($scope, $uibModalInstance, csbQuery, userName, $window, $log, redirectService) {

      var warningCheck = false;
      var remoteUpgradeDisclaimer = false;
      var remoteMonitoringDisclaimer = false;

      $log.debug("user name: " + userName);


      /* Administrator processing */
      if (userName === "Admin") {
        csbQuery.getObj("SERIALNUM,FRIENDLYNAME,ADMIN/WARNING/CHECK,ADMIN/DISCLCHECK,REMOTEUPGRADE/DISCLAIMER")
            .then(function (data) {
              /* Assign system variables */
              $scope.productId = data.SERIALNUM;
              $scope.deviceName = data.FRIENDLYNAME;
              warningCheck = data.ADMIN_WARNING ? true : false;
              remoteUpgradeDisclaimer = data.REMOTEUPGRADE_DISCLAIMER ? true : false;
              remoteMonitoringDisclaimer = data.ADMIN_DISCLCHECK ? true : false;

              /* Turn on and off section of disclaimer page */
              if (!warningCheck) {
                $scope.hazardWarning = true;
                $scope.remoteUpgrade = true;
                $scope.remoteUpgradeChecked = remoteUpgradeDisclaimer;
                $scope.remoteMonitoring = true;
                $scope.remoteMonitorChecked = remoteMonitoringDisclaimer;
              } else {
                $scope.hazardWarning = false;
                $scope.remoteUpgrade = false;
                $scope.remoteMonitoring = true;
              }
            }, function (error) {
              $log.error(error);
              /* Redirect to login page for authentication error */
              if (error.status == AUTHENTICATON_ERROR) {
                redirectService.redirectToLogin();
              }

            });
      } else {
        /* User initializaton processing */
        csbQuery.getObj("SERIALNUM,FRIENDLYNAME,USER.WARNING.CHECK,USER.DISCLCHECK")
            .then(function (data) {
              /* Assign system variables */
              $scope.productId = data.SERIALNUM;
              $scope.deviceName = data.FRIENDLYNAME;
              warningCheck = data.USER_WARNING ? true : false;

              /* Turn on and off disclaimer page */
              if (!warningCheck) {
                $scope.hazardWarning = true;
                $scope.remoteUpgrade = false;
                $scope.remoteMonitoring = false;
              } else {
                $scope.hazardWarning = false;
                $scope.remoteUpgrade = false;
                if (data.USER.DISCLCHECK === 0) {
                  $scope.remoteMonitoring = false;
                } else {
                  $scope.remoteMonitoring = true;
                }
              }

            }, function (error) {
              $log.error(error);
            });

      }


      /*========================================================================*/
      //fn  disclaimerAcceptClicked
      /*!

      This process the event when the disclamer acceptance button pressed.

      @return  null

      *//*
      REVISION HISTORY:

      Version: 1.01  Date: 19-Jan-2018   By: Eddie Leung
        - Changed SysVar name
      */
      /*========================================================================*/
      $scope.disclaimerAcceptClicked = function () {
        var requestObject = {};
        if (userName == "Admin") {
          /* Set the user acceptance check status before redirect */
          requestObject["ADMIN/WARNING/CHECK"] = 1;
          if ($scope.remoteMonitoring) {
            var remoteMonitorSysvarVal = $("#chkDisclaimer").prop('checked') === true ? 1 : 0;
            requestObject["ADMIN/DISCLCHECK"] = remoteMonitorSysvarVal;
            requestObject["WEBPORTAL/ENABLE"] = remoteMonitorSysvarVal;
            requestObject['/SCB/IOT/ENABLE'] = remoteMonitorSysvarVal;
          }
          if ($scope.remoteUpgrade) {
            var remoteUpgradeSysvarVal = $("#chkRemoteDisclaimer").prop('checked') === true ? 1 : 0;
            requestObject["REMOTEUPGRADE/DISCLAIMER"] = remoteUpgradeSysvarVal;
            requestObject["REMOTEUPGRADE/ENABLE"] = remoteUpgradeSysvarVal;
          }
        } else {
          /* Set the user acceptance check status before redirect */
          requestObject["USER/WARNING/CHECK"] = 1;
        }
        /* Set the user acceptance status */
        csbQuery.setFromObject(requestObject, true).then(function (success) {
          $uibModalInstance.close("close ");
        }, function (error) {
          $log.error(error);
        });

      };


    }]);

/* Services injected */

/**
 *
 * This initially acquires all the necessary information from Conext Gateway regarding
 *      Disclamer page.  Then it includes event processing for the acceptance
 *      click.
 *
 * @param $scope    Angular service for HTML variable matching
 *
 * @param $uibModalInstance   Modal instance processing
 *
 * @param csbQuery  Coenxt Gateway query processing.
 *
 * @param userName  user name.
 *
 */


/**
 *
 * Disclaimer controller code end
 *
 */
